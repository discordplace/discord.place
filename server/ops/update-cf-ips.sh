#!/bin/bash
#
# Refresh HAProxy's Cloudflare origin-allowlist.
#
# haproxy.cfg rejects every non-Cloudflare source at L4:
#   tcp-request connection reject unless from_cf or from_localhost
# so this file is the only thing letting Cloudflare reach the backends. If
# Cloudflare publishes a new range that is missing here, that traffic is
# silently dropped. Conversely, if this file were ever replaced with garbage,
# the origin would lock itself out completely.
#
# Run weekly from root's crontab. Intentionally only ever writes to DEST_FILE
# when the freshly-fetched list validates as real CIDR ranges.

set -uo pipefail

V4_URL="https://www.cloudflare.com/ips-v4"
V6_URL="https://www.cloudflare.com/ips-v6"
DEST_FILE="/etc/haproxy/cloudflare-ips.txt"
TMP_FILE="$(mktemp /etc/haproxy/.cf-ips.XXXXXX)"
BACKUP="${DEST_FILE}.bak"

# Cron runs jobs concurrently; only one update at a time.
LOCK="/run/update-cf-ips.lock"
exec 9>"$LOCK"
if ! flock -n 9; then
    echo "$(date -Is) another update is already running, skipping"
    exit 0
fi

cleanup() { rm -f "$TMP_FILE"; }
trap cleanup EXIT

echo "$(date -Is) fetching Cloudflare IP ranges"

# --fail makes curl exit non-zero on HTTP errors, so a 503 page is never
# mistaken for a valid list. --max-time prevents a hung request from
# overlapping the next cron run.
if ! curl -sSfL --max-time 30 --retry 2 --retry-delay 5 "$V4_URL" -o "$TMP_FILE"; then
    echo "$(date -Is) ERROR: failed to fetch $V4_URL; leaving $DEST_FILE untouched"
    exit 1
fi
echo "" >> "$TMP_FILE"
if ! curl -sSfL --max-time 30 --retry 2 --retry-delay 5 "$V6_URL" >> "$TMP_FILE"; then
    echo "$(date -Is) ERROR: failed to fetch $V6_URL; leaving $DEST_FILE untouched"
    exit 1
fi

# Validate strictly: every non-blank line must be a real IPv4/IPv6 CIDR.
# This is what the previous version got wrong -- `grep -q "/"` also matches
# an HTML error page, which would have been written straight into the
# allowlist.
valid=1
v4=0
v6=0
while read -r line || [ -n "$line" ]; do
    [ -z "$line" ] && continue

    if [[ "$line" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/[0-9]+$ ]]; then
        v4=$((v4 + 1))
    elif [[ "$line" =~ ^[0-9a-fA-F:]+:[0-9a-fA-F:]*\/[0-9]+$ ]]; then
        v6=$((v6 + 1))
    else
        echo "$(date -Is) ERROR: unexpected content, not an IP range: $line"
        valid=0
        break
    fi
done < "$TMP_FILE"

# Cloudflare publishes 15 IPv4 + 7 IPv6. Require enough ranges that a
# truncated response can never be mistaken for a good one.
if [ "$valid" -ne 1 ] || [ "$v4" -lt 10 ] || [ "$v6" -lt 3 ]; then
    echo "$(date -Is) ERROR: validation failed (v4=$v4 v6=$v6); leaving $DEST_FILE untouched"
    exit 1
fi

# No-op when nothing changed, so weekly runs don't reload haproxy needlessly.
if [ -f "$DEST_FILE" ] && cmp -s "$TMP_FILE" "$DEST_FILE"; then
    echo "$(date -Is) up to date (v4=$v4 v6=$v6), no change"
    exit 0
fi

added=$(comm -13 <(grep . "$DEST_FILE" 2>/dev/null | sort -u) <(grep . "$TMP_FILE" | sort -u) | tr '\n' ' ')
removed=$(comm -23 <(grep . "$DEST_FILE" 2>/dev/null | sort -u) <(grep . "$TMP_FILE" | sort -u) | tr '\n' ' ')

cp -a "$DEST_FILE" "$BACKUP" 2>/dev/null

# Promote, then prove the real config still parses with the new list. Roll
# back immediately if it doesn't, so a bad list can never persist.
cat "$TMP_FILE" > "$DEST_FILE"

if ! haproxy -c -f /etc/haproxy/haproxy.cfg >/dev/null 2>&1; then
    echo "$(date -Is) ERROR: haproxy rejected the new list, rolling back"
    [ -f "$BACKUP" ] && mv "$BACKUP" "$DEST_FILE"
    haproxy -c -f /etc/haproxy/haproxy.cfg 2>&1 | grep -i alert
    exit 1
fi

rm -f "$BACKUP"
systemctl reload haproxy

logger -t update-cf-ips "updated: +[${added:-none}] -[${removed:-none}] now v4=$v4 v6=$v6"
echo "$(date -Is) updated: +[${added:-none}] -[${removed:-none}] now v4=$v4 v6=$v6"
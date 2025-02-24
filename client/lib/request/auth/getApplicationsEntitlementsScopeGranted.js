import ClientRequestClient from '@/lib/request/clientRequest';

export default function getApplicationsEntitlementsScopeGranted() {
  const endpoint = '/auth/@me/applications-entitlements-scope-granted';

  return ClientRequestClient.get(endpoint);
}
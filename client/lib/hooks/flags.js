'use client';

import { t } from '@/stores/language';

const flagsPositions = [
  'Staff',
  'Partner',
  'CertifiedModerator',
  'Hypesquad',
  'HypeSquadOnlineHouse1',
  'HypeSquadOnlineHouse2',
  'HypeSquadOnlineHouse3',
  'BugHunterLevel1',
  'BugHunterLevel2',
  'ActiveDeveloper',
  'PremiumEarlySupporter',
  'VerifiedDeveloper',
  'Nitro'
];

export function useFlagTranslations() {
  const flags = Object.fromEntries(flagsPositions
    .filter(flag => flagsPositions.includes(flag))
    .map(flag => ([flag, t(`userProfile.flags.${flag}`)])));

  return flags;
}

export function useSortFlags(flags) {
  const sortedFlags = flags.sort((a, b) => flagsPositions.indexOf(a) - flagsPositions.indexOf(b));

  return sortedFlags;
}
import dataDefaults from './data';
import utils from './utils';

function getLoginURL(pathname, searchParams) {
  const queryString = searchParams?.toString();

  return `${dataDefaults.api.url}/auth/login?redirect=${encodeURIComponent(dataDefaults.baseUrl + pathname + (queryString ? `?${queryString}` : ''))}`;
}

function applicationsEntitlementsScopeURL() {
  return `${dataDefaults.api.url}/auth/applicationsEntitlementsScope`;
}

const config = {
  ...dataDefaults,
  ...utils,
  applicationsEntitlementsScopeURL,
  getLoginURL
};

export default config;

import dataDefaults from './data';
import utils from './utils';

function getLoginURL(pathname) {
  return `${dataDefaults.api.url}/auth/login?redirect=${encodeURIComponent(dataDefaults.baseUrl + pathname)}`;
}

function applicationsEntitlementsScopeURL(userId) {
  return `${dataDefaults.api.url}/auth/applicationsEntitlementsScope?userId=${userId}`;
}

const config = {
  ...dataDefaults,
  ...utils,
  applicationsEntitlementsScopeURL,
  getLoginURL
};

export default config;

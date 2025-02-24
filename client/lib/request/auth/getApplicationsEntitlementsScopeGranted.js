import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getApplicationsEntitlementsScopeGranted() {
  const endpoint = Endpoints.GetApplicationsEntitlementsScopeGranted;

  return ClientRequestClient.get(endpoint);
}
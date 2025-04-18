const axios = require('axios');
const getProxyAgent = require('@/utils/getProxyAgent');
const IpDetails = require('@/schemas/IpDetails');

async function getIpDetails(ip) {
  if (!ip) return null;

  const cachedIpDetails = await IpDetails.findOne({ ip }).select('-_id -__v -createdAt -updatedAt').lean();
  if (cachedIpDetails) return cachedIpDetails;

  const axiosInstance = axios.create();

  const headers = {
    'User-Agent': 'discord.place (https://discord.place)',
    'Content-Type': 'application/json'
  };

  const requestConfig = {
    url: `http://ip-api.com/json/${ip}?fields=16993817`,
    method: 'GET',
    headers,
    timeout: 5000,
    responseType: 'json'
  };

  if (process.env.WEBHOOKS_PROXY_SERVER_HOST) {
    try {
      requestConfig.httpsAgent = getProxyAgent();
    } catch (error) {
      logger.error('Error while creating proxy agent for getting ip details request:', error);
    }
  }

  try {
    const response = await axiosInstance(requestConfig);
    if (!response || response.status !== 200 || response.data?.status !== 'success') return null;

    new IpDetails({
      ip,
      country: response.data.country,
      regionName: response.data.regionName,
      city: response.data.city,
      isp: response.data.isp,
      org: response.data.org,
      as: response.data.as,
      mobile: response.data.mobile,
      proxy: response.data.proxy,
      hosting: response.data.hosting
    }).save();

    return response.data;
  } catch (error) {
    logger.error(`Error while getting ip ${ip}'s details:`, error.response);

    return null;
  }
}

module.exports = getIpDetails;
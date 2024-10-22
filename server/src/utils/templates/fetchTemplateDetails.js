const axios = require('axios');

async function fetchTemplateDetails(id) {
  const response = await axios.get(`https://discord.com/api/v6/guilds/templates/${id}`);

  return response.data;
}

module.exports = fetchTemplateDetails;
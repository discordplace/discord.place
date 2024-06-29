const axios = require('axios');
const GitHubCache = require('@/schemas/Bot/GitHubCache');

async function findRepository(repository, bypassCache) {
  const usernameRepositoryRegex = /^([a-zA-Z\d]{1}[-a-zA-Z\d]+)(\/){1}([-\w.]+)$/i;
  if (!usernameRepositoryRegex.test(repository)) return null;
  
  const [username, repositoryName] = repository.split('/');
  
  try {
    if (!bypassCache) {
      const foundCache = await GitHubCache.findOne({ 'data.full_name': repository });
      if (foundCache) return foundCache.data;
    }
    
    const response = await axios.get(`https://api.github.com/repos/${username}/${repositoryName}`);
    if (response.status !== 200) return null;

    new GitHubCache({
      data: {
        html_url: response.data.html_url,
        language: response.data.language,
        owner: {
          login: response.data.owner.login
        },
        name: response.data.name,
        description: response.data.description,
        stargazers_count: response.data.stargazers_count,
        forks_count: response.data.forks_count
      }
    }).save();

    return response.data;
  } catch {
    return null;
  }
}

module.exports = findRepository;
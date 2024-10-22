const GitHubCache = require('@/schemas/Bot/GitHubCache');
const axios = require('axios');

async function findRepository(repository, bypassCache) {
  const usernameRepositoryRegex = /^([a-zA-Z\d]{1}[-a-zA-Z\d]+)(\/){1}([-\w.]+)$/i;
  if (!usernameRepositoryRegex.test(repository)) return null;

  const [username, repositoryName] = repository.split('/');

  try {
    if (!bypassCache) {
      const foundCache = await GitHubCache.findOne({ 'data.name': repositoryName, 'data.owner.login': username });
      if (foundCache) return foundCache.data;
    }

    const response = await axios.get(`https://api.github.com/repos/${username}/${repositoryName}`);
    if (response.status !== 200) return null;

    new GitHubCache({
      data: {
        description: response.data.description,
        forks_count: response.data.forks_count,
        html_url: response.data.html_url,
        language: response.data.language,
        name: response.data.name,
        owner: {
          avatar_url: response.data.owner.avatar_url,
          login: response.data.owner.login
        },
        stargazers_count: response.data.stargazers_count
      }
    }).save();

    return response.data;
  } catch {
    return null;
  }
}

module.exports = findRepository;
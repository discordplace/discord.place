module.exports = async (oldUser, newUser) => {
  if (oldUser.banner !== newUser.banner && client.forceFetchedUsers.has(newUser.id)) {
    await client.users.fetch(newUser.id, { force: true })
      .then(user => logger.send(`User ${user.id} has changed their banner, force fetched user data.`))
      .catch(err => logger.send(`User ${newUser.id} has changed their banner, but an error occurred while force fetching user data:\n${err.stack}`));
  }
};
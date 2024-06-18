const Reward = require('@/schemas/Server/Vote/Reward');
const Server = require('@/schemas/Server');
const sendLog = require('@/src/utils/servers/sendLog');
const Discord = require('discord.js');
const User = require('@/schemas/User');

module.exports = async member => {
  if (member.user.bot) return;

  const userData = await User.findOne({ id: member.user.id });
  if (userData?.subscription && member.guild.id === config.guild.id && !member.roles.cache.has(config.roles.premium)) await member.roles.add(config.roles.premium);

  const rewards = await Reward.find({ 'guild.id': member.guild.id });
  if (!rewards.length) return;

  const server = await Server.findOne({ id: member.guild.id });
  if (!server) return;

  const voter = server.voters.find(voter => voter.user.id === member.id);
  if (!voter) return;

  for (const reward of rewards.sort((a, b) => b.required_votes - a.required_votes)) {
    if (voter.vote >= reward.required_votes) {
      const role = member.guild.roles.cache.get(reward.role.id);
      if (!role) {
        await Reward.deleteOne({ 'role.id': reward.role.id });

        sendLog(member.guild.id, `Role with ID ${reward.role.id} has been deleted from the database because it was not found in the server.`)
          .catch(() => null);
        
        logger.warn(`Role with ID ${reward.role.id} has been deleted from the database because it was not found in server ${member.guild.id}.`);

        continue;
      }

      if (member.roles.cache.has(role.id)) break;

      member.roles.add(role, `Voted ${voter.vote} times for the server. This role was given as a reward.`)
        .then(async () => {
          sendLog(member.guild.id, `**@${Discord.escapeMarkdown(member.user.username)}** (${member.user.id}) has been given the reward role **${role.name}** for voting ${voter.vote} times. (Newly joined)`)
            .catch(() => null);

          const dmChannel = member.user.dmChannel || await member.user.createDM().catch(() => null);
          if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYou have been given the reward role **${role.name}** in **${member.guild.name}** for voting ${voter.vote} times!` }).catch(() => null);
        })
        .catch(error => {
          sendLog(member.guild.id, `Failed to give the reward role **${role.name}** to **@${Discord.escapeMarkdown(member.user.username)}** (${member.user.id}). (Error: ${error.message})`)
            .catch(() => null);
        });

      logger.info(`User ${member.user.id} has been given the reward role ${role.name} for voting ${voter.vote} times in server ${member.guild.id}. (Newly joined)`);

      break;
    }
  }
};
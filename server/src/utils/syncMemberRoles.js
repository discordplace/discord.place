const User = require('@/schemas/User');
const sleep = require('@/utils/sleep');
const dedent = require('dedent');
const fs = require('node:fs');
const path = require('node:path');

async function syncMemberRoles() {
  const guild = client.guilds.cache.get(config.guildId);
  const members = await guild.members.fetch();
  const currentDate = new Date();

  const premiumUsers = await User.find({ subscription: { $ne: null } });

  const translatorsArray = fs.readFileSync(path.resolve(__dirname, '../../../translators.json'), 'utf8');
  const translators = JSON.parse(translatorsArray);

  const roles = [
    {
      condition: member => premiumUsers.find(premium => premium.id === member.user.id),
      roleId: config.roles.premium
    },
    {
      condition: member => translators.some(userId => userId === member.user.id),
      roleId: config.roles.translator
    }
  ];

  await Promise.all(
    roles.map(async ({ condition, roleId }) => {
      const role = guild.roles.cache.get(roleId);
      if (!role) throw new Error(`Role with ID ${roleId} not found.`);

      const membersToGiveRole = members.filter(member => condition(member) && !member.roles.cache.has(roleId));
      const membersToRemoveRole = members.filter(member => !condition(member) && member.roles.cache.has(roleId));
      const membersToUpdate = membersToGiveRole.concat(membersToRemoveRole).map(member => member.user.id);

      if (membersToUpdate.length <= 0) return;

      const estimatedTime = membersToUpdate.length * 1000;
      logger.info(`Syncing ${role.name} roles for ${membersToUpdate.length} members. Estimated time: ${estimatedTime / 1000} seconds.`);

      for (const memberId of membersToUpdate) {
        const member = members.get(memberId);
        if (!member) continue;

        if (membersToGiveRole.some(collectedMember => collectedMember.user.id == member.user.id)) {
          await member.roles.add(role);

          const isTranslatorRoleGiven = role.id === config.roles.translator;

          if (isTranslatorRoleGiven) {
            const dmChannel = member.dmChannel || await member.createDM().catch(() => null);
            if (dmChannel) {
              // Send a message to the user that they've been given the Translator role
              member.send({ content: dedent`
                Hey there, Language Legend! 🌍✨

                A huge thank you for stepping up and helping us localize the site. You've earned the Translator role, and we couldn’t be more grateful for your contribution! 🎉
              ` }).catch(() => null);
            }
          }
        }
        if (membersToRemoveRole.some(collectedMember => collectedMember.user.id == member.user.id)) await member.roles.remove(role);

        await sleep(1000);
      }

      logger.info(`Successfully synced ${role.name} roles for ${membersToUpdate.length} members.`);
    })
  )
    .catch(error => logger.error('Failed to sync member roles:', error))
    .finally(() => logger.info(`Synced member roles for ${members.size} members in ${new Date() - currentDate}ms.`));
}

module.exports = syncMemberRoles;
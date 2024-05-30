const Server = require('@/schemas/Server');
const createActivity = require('@/utils/createActivity');

module.exports = async invite => {
  const data = await Server.findOne({ 'id': invite.guild.id });
  if (!data) return;

  if (data.invite_code.type === 'Invite' && data.invite_code.code === invite.code) {
    await data.updateOne({ $set: { invite_code: { type: 'Deleted' } } });

    createActivity({
      type: 'MODERATOR_ACTIVITY',
      user_id: client.user.id,
      target: invite.guild,
      message: `Invite code ${data.invite_code.code} was deleted.`
    });
  }
};
const Server = require('@/schemas/Server');

module.exports = async invite => {
  const data = await Server.findOne({ 'id': invite.guild.id });
  if (!data) return;

  if (data.invite_code.type === 'Invite' && data.invite_code.code === invite.code) await data.updateOne({ $set: { invite_code: { type: 'Deleted' } } });
};
function inviteLinkValidation(value) {
  const inviteLinkMatch = value.match(/(https?:\/\/|http?:\/\/)?(www.)?(discord.(gg)|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=$|Z)/g);
  if (!inviteLinkMatch || !inviteLinkMatch?.[0]) throw new Error('Invite link is not valid.');

  return true;
}

module.exports = inviteLinkValidation;

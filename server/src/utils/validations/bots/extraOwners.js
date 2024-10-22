function extraOwnersValidation(userIds) {
  if (userIds.length > config.botMaxExtraOwners) throw new Error(`Extra owners can't be more than ${config.botMaxExtraOwners}.`);

  for (const userId of userIds) {
    if (userId.length < 17 || userId.length > 19) throw new Error('Extra owners must be a valid user id.');
    if (userIds.filter(id => id === userId).length > 1) throw new Error('Extra owners must be unique.');
  }

  return true;
}

module.exports = extraOwnersValidation;
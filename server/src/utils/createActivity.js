const DashboardActivity = require('@/schemas/Dashboard/Activity');
const getValidationError = require('@/utils/getValidationError');
const Discord = require('discord.js');

async function createActivity({ type, user_id, target, target_type, message }) {
  const activity = new DashboardActivity({
    type,
    user: {
      id: user_id
    },
    target: {
      type: target_type || target instanceof Discord.Guild ? 'GUILD' : 'USER',
      id: target.id
    },
    message
  });

  const validationError = getValidationError(activity);
  if (validationError) throw new Error(validationError);

  return activity.save();
}

module.exports = createActivity;
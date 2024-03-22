const Review = require('@/schemas/Server/Review');

module.exports = guild => Review.deleteMany({ 'server.id': guild.id, approved: false });
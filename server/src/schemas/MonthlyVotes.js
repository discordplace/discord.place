const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonthlyVotesSchema = new Schema({
  identifier: String,
  data: [
    {
      month: Number,
      year: Number,
      votes: Number,
      created_at: {
        type: Date,
        default: Date.now
      },
      most_voted_user: {
        type: String,
        default: null,
        required: false
      },
      is_most_voted: {
        type: Boolean,
        default: false
      }
    }
  ]
}, {
  timestamps: true
});

MonthlyVotesSchema.statics.updateMonthlyVotes = async function (identifier, data, Model) {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const mostVotedUser = data.voters.sort((a, b) => b.vote - a.vote)[0];

  const updateData = {
    month,
    year,
    votes: data.votes,
    created_at: new Date(),
    most_voted_user: mostVotedUser ? mostVotedUser.user.id : null,
    is_most_voted: data.isMostVoted
  };

  // Try to update the existing document
  const foundDocument = await this.findOne({ identifier });
  if (!foundDocument) {
    // If no document exists, create a new one
    await this.create({
      identifier,
      data: [updateData]
    });
  } else {
    // If a document exists, check if the month/year data already exists
    const existingData = foundDocument.data.find(data => data.month === month && data.year === year);
    if (existingData) {
      // If it exists, update the existing data
      existingData.votes = data.votes;
      existingData.most_voted_user = mostVotedUser ? mostVotedUser.user.id : null;
      existingData.is_most_voted = data.isMostVoted;

      await foundDocument.save();
    } else {
      // If it doesn't exist, push the new data
      foundDocument.data.push(updateData);

      await foundDocument.save();
    }
  }

  // Reset votes for the next month
  await Model.updateOne({ id: identifier }, { $set: { votes: 0 } });
};

const ServerMonthlyVotes = mongoose.model('ServerMonthlyVotes', MonthlyVotesSchema);
const BotMonthlyVotes = mongoose.model('BotMonthlyVotes', MonthlyVotesSchema);

module.exports = {
  ServerMonthlyVotes,
  BotMonthlyVotes
};
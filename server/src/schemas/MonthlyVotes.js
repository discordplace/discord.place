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

  const query = { identifier };
  const updateData = {
    month,
    year,
    votes: data.votes,
    created_at: new Date(),
    most_voted_user: mostVotedUser ? mostVotedUser.user.id : null,
    is_most_voted: data.isMostVoted
  };

  // Try to update the existing document
  const result = await this.updateOne(
    { identifier, 'data.month': month, 'data.year': year },
    {
      $set: {
        'data.$.votes': data.votes,
        'data.$.most_voted_user': mostVotedUser ? mostVotedUser.user.id : null
      }
    }
  );

  // If no document was modified, it means we need to add new data for the current month/year
  if (result.modifiedCount === 0) {
    await this.updateOne(
      query,
      { $push: { data: updateData } },
      { upsert: true }
    );
  }

  await Model.updateOne({ id: identifier }, { $set: { votes: 0 } });
};

const ServerMonthlyVotes = mongoose.model('ServerMonthlyVotes', MonthlyVotesSchema);
const BotMonthlyVotes = mongoose.model('BotMonthlyVotes', MonthlyVotesSchema);

module.exports = {
  ServerMonthlyVotes,
  BotMonthlyVotes
};
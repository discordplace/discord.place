const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonthlyVotesSchema = new Schema({
  data: [
    {
      created_at: {
        default: Date.now,
        type: Date
      },
      month: Number,
      most_voted: {
        default: null,
        required: false,
        type: String
      },
      votes: Number,
      year: Number
    }
  ],
  identifier: String
}, {
  timestamps: true
});

MonthlyVotesSchema.statics.updateMonthlyVotes = async function (identifier, votes, Model) {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const mostVoted = await Model.findOne({ id: identifier }).sort({ votes: -1 }).limit(1);
  const query = { identifier };
  const updateData = { created_at: new Date(), month, most_voted: mostVoted ? mostVoted.id : null, votes, year };

  // Try to update the existing document
  const result = await this.updateOne(
    { 'data.month': month, 'data.year': year, identifier },
    {
      $set: {
        'data.$.most_voted': mostVoted ? mostVoted.id : null,
        'data.$.votes': votes
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
  BotMonthlyVotes,
  ServerMonthlyVotes
};
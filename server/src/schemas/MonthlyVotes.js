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
      most_voted: {
        type: String,
        default: null,
        required: false
      }
    }
  ]
}, {
  timestamps: true
});

MonthlyVotesSchema.statics.updateMonthlyVotes = async function (identifier, votes, Model) {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const mostVoted = await Model.findOne({ id: identifier }).sort({ votes: -1 }).limit(1);
  const query = { identifier: identifier };
  const updateData = { month, year, votes, created_at: new Date(), most_voted: mostVoted ? mostVoted.id : null };

  // Try to update the existing document
  const result = await this.updateOne(
    { identifier: identifier, 'data.month': month, 'data.year': year },
    { 
      $set: {
        'data.$.votes': votes,
        'data.$.most_voted': mostVoted ? mostVoted.id : null
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
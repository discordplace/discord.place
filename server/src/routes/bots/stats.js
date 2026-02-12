const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/schemas/Bot');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    async (_request, response) => {
      const [stats] = await Bot.aggregate([
        {
          $match: {
            verified: true,
            verified_at: { $ne: null }
          }
        },
        {
          $project: {
            createdAt: 1,
            approvedAt: '$verified_at'
          }
        },
        {
          $project: {
            durationMs: {
              $subtract: ['$approvedAt', '$createdAt']
            }
          }
        },
        {
          $match: {
            durationMs: {
              $gte: 0
            }
          }
        },
        {
          $group: {
            _id: null,
            averageMs: {
              $avg: '$durationMs'
            },
            sampleSize: {
              $sum: 1
            }
          }
        }
      ]);

      if (!stats) {
        return response.json({
          average_bot_approval_time_minutes: null,
          average_bot_approval_time_hours: null,
          sample_size: 0
        });
      }

      const averageMinutes = Math.round(stats.averageMs / (1000 * 60));
      const averageHours = Number((stats.averageMs / (1000 * 60 * 60)).toFixed(1));

      return response.json({
        average_bot_approval_time_minutes: averageMinutes,
        average_bot_approval_time_hours: averageHours,
        sample_size: stats.sampleSize
      });
    }
  ]
};

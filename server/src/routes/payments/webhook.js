const bodyParser = require('body-parser');
const crypto = require('crypto');
const Plan = require('@/schemas/LemonSqueezy/Plan');
const User = require('@/schemas/User');

module.exports = {
  post: [
    bodyParser.raw({ type: 'application/json' }),
    async (request, response) => {
      const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
      const digest = Buffer.from(hmac.update(request.body).digest('hex'), 'utf-8');
      const signature = Buffer.from(request.headers['x-signature'], 'utf-8');
    
      try {
        if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
          return response.sendError('Invalid signature', 403);
        }
      } catch (error) {
        return response.sendError('Invalid signature', 403);
      }

      const body = JSON.parse(request.body.toString());

      switch (body.meta.event_name) {
      case 'order_created':
        var user_id = body.meta.custom_data?.user_id;
        if (!user_id) return response.sendError('User ID not found', 400);

        var user = await User.findOne({ id: user_id });
        if (!user) return response.sendError('User not found', 404);

        var plan = await Plan.findOne({ id: body.data.attributes.first_order_item.product_id });
        if (!plan) return response.sendError('Plan not found', 404);

        user.subscription = {
          id: body.data.id,
          orderId: body.data.attributes.order_number,
          productId: body.data.attributes.first_order_item.product_id,
          planId: plan.id,
          createdAt: new Date(body.data.attributes.created_at)
        };

        await user.save();

        break;
      case 'order_refunded':
        // eslint-disable-next-line no-redeclare
        var user = await User.findOne({ 'subscription.orderId': body.data.attributes.order_number });
        if (!user) return response.sendError('User not found', 404);

        user.subscription = null;

        await user.save();

        break;
      case 'subscription_expired':
        // eslint-disable-next-line no-redeclare
        var user = await User.findOne({ 'subscription.id': body.data.id });
        if (!user) return response.sendError('User not found', 404);

        user.subscription = null;

        await user.save();

        break;
      }

      return response.json({ status: 'success' });
    }
  ]
};

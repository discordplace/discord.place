const useRateLimiter = require("@/utils/useRateLimiter");
const {
  param,
  body,
  matchedData,
  validationResult,
} = require("express-validator");
const Bot = require("@/schemas/Bot");
const bodyParser = require("body-parser");

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 2, perMinutes: 120 }),
    bodyParser.json(),
    param("id"),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty())
        return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const botUser =
        client.users.cache.get(id) ||
        (await client.users.fetch(id).catch(() => null));
      if (!botUser) return response.sendError("Bot not found.", 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError("Bot not found.", 404);
      const seoMetadataKeyword = [`${bot.username} bot`, `discord bot ${bot.username}`, `${bot.username}#${bot.discriminator}`, `${bot.username}#${bot.discriminator} discord bot`, `discord.place ${bot.username}`, `${bot.owner.username} discord`, `${bot.owner.username}'s bot ${bot.username}`, `${bot.invite_url.split("https://")}`, `discord bots ${bot.username}`]
      
      return response.json({ success: true, props:{
        keywords: seoMetadataKeyword,
        ld: {
            "@context":"https://schema.org",
            "@type": "Product",
            "sku": bot.id,
            "name": bot.username,
            "image": bot.avatar_url,
            "banner": bot.banner_url,
            "servers": bot.servers,
            "discriminator": bot.discriminator,
            "description": bot.short_description,
            "author": {
                "name": bot.owner.username,
                "image": bot.owner.avatar_url,
                "premium": bot.owner.premium ? true: false
            },
            "verified": bot.verified ? true : false,
            "votes": {
                "@type": "Rating",
                "votes": bot.votes
            },
            "commands": {
                "@type": "Commands",
                "commands": bot.commands
            },
            "categories":  bot.categories
        }
      } });
    },
  ],
};

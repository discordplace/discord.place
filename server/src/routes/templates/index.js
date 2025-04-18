const categoriesValidation = require('@/utils/validations/templates/categories');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, matchedData } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const Template = require('@/schemas/Template');
const getValidationError = require('@/utils/getValidationError');
const Discord = require('discord.js');
const fetchTemplateDetails = require('@/utils/templates/fetchTemplateDetails');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    body('id')
      .isString().withMessage('ID should be a string.')
      .isLength({ min: 12, max: 12 }).withMessage('ID must be 12 characters.'),
    body('name')
      .isString().withMessage('Name should be a string.')
      .trim()
      .isLength({ max: config.templateNameMaxLength }).withMessage(`Name must be less than ${config.templateNameMaxLength} characters.`),
    body('description')
      .isString().withMessage('Description should be a string.')
      .trim()
      .isLength({ min: config.templateDescriptionMinLength, max: config.templateDescriptionMaxLength }).withMessage(`Description must be between ${config.templateDescriptionMinLength} and ${config.templateDescriptionMaxLength} characters.`),
    body('categories')
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    validateRequest,
    async (request, response) => {
      const { id, name, description, categories } = matchedData(request);

      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'TEMPLATES_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create templates.', 403);

      const templateFound = await Template.findOne({ id });
      if (templateFound) return response.sendError('Template already exists.', 400);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const templateDetails = await fetchTemplateDetails(id).catch(() => null);
      if (!templateDetails) return response.sendError('Invalid template ID.', 400);

      const template = new Template({
        id,
        data: templateDetails.serialized_source_guild,
        user: {
          id: request.user.id,
          username: request.user.username
        },
        name,
        description,
        categories,
        uses: 0,
        approved: false
      });

      const validationError = getValidationError(template);
      if (validationError) return response.sendError(validationError, 400);

      await template.save();

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('New Template Submitted')
          .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
          .setFields([
            {
              name: 'Template',
              value: `${name} (ID: ${id})`,
              inline: true
            },
            {
              name: 'Description',
              value: description,
              inline: true
            }
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Purple)
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/templates/${id}/preview`)
              .setLabel('Preview Template on discord.place')
          )
      ];

      client.channels.cache.get(config.templateQueueChannelId).send({ embeds, components });

      sendLog(
        'templateCreated',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Template', value: `${template.name} (${template.id})` }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'Preview Template', url: `${config.frontendUrl}/templates/${id}/preview` }
        ]
      );

      return response.json(template);
    }
  ]
};
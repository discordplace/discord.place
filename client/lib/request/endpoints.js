const Endpoints = {
  // Themes
  ThemeMetadata: themeId => `/themes/${themeId}/metadata`,
  Themes: id => `/themes/${id}`,
  FetchThemes: '/themes/search',
  DenyTheme: id => `/themes/${id}/deny`,
  DeleteTheme: id => `/themes/${id}`,
  CreateTheme: '/themes',
  ApproveTheme: id => `/themes/${id}/approve`,

  // Templates
  TemplateMetadata: id => `/templates/${id}/metadata`,
  Templates: id => `/templates/${id}`,
  FetchTemplates: '/templates/search',
  DenyTemplate: id => `/templates/${id}/deny`,
  DeleteTemplate: id => `/templates/${id}`,
  CreateTemplate: '/templates',
  ApproveTemplate: id => `/templates/${id}/approve`,
  FetchTemplateDetails: id => `/guilds/templates/${id}`,

  // Sounds
  SoundMetadata: id => `/sounds/${id}/metadata`,
  Sounds: id => `/sounds/${id}`,
  FetchSounds: '/sounds/search',
  DenySound: id => `/sounds/${id}/deny`,
  DeleteSound: id => `/sounds/${id}`,
  CreateSound: '/sounds',
  ApproveSound: id => `/sounds/${id}/approve`,
  UploadSoundToGuild: id => `/sounds/${id}/upload-to-guild`,
  LikeSound: id => `/sounds/${id}/like`,
  IncrementSoundDownloads: id => `/sounds/${id}/downloads`,

  // Servers
  VoteServer: id => `/servers/${id}/vote`,
  SetServerWebhookSettings: id => `/servers/${id}/webhook-settings`,
  ServerMetadata: id => `/servers/${id}/metadata`,
  Server: id => `/servers/${id}`,
  FetchServerVoters: id => `/servers/${id}/voters`,
  FetchServers: '/servers/search',
  FetchServerReviews: id => `/servers/${id}/reviews`,
  DenyServerReview: (serverId, reviewId) => `/servers/${serverId}/reviews/${reviewId}/deny`,
  ApproveServerReview: (serverId, reviewId) => `/servers/${serverId}/reviews/${reviewId}/approve`,
  DeleteServerWebhookSettings: id => `/servers/${id}/webhook-settings`,
  DeleteServerTimeout: (serverId, userId) => `/servers/${serverId}/voters/${userId}/timeout`,
  DeleteServer: id => `/servers/${id}`,
  DeleteServerReview: (serverId, reviewId) => `/servers/${serverId}/reviews/${reviewId}`,

  // Payments
  CreateTripledVotesCheckout: '/payments/checkout',
  CreateStandedOutCheckout: '/payments/checkout',
  GetPlans: '/payments/plans',
  SyncLemonSqueezyPlans: '/payments/plans/sync',

  // Profiles
  PatchProfileVerify: slug => `/profiles/${slug}`,
  LikeProfile: slug => `/profiles/${slug}/like`,
  IncrementViews: slug => `/profiles/${slug}/views`,
  GetProfileMetadata: id => `/profiles/${id}/metadata`,
  GetProfile: slug => `/profiles/${slug}`,
  EditProfile: slug => `/profiles/${slug}`,
  AddSocial: slug => `/profiles/${slug}`,
  DeleteSocial: (slug, socialId) => `/profiles/${slug}/socials/delete/${socialId}`,
  DeleteProfile: slug => `/profiles/${slug}/delete`,
  CreateProfile: '/profiles',
  CheckSlugAvailability: '/profiles/check-slug-availability',

  // Links
  DeleteLink: id => `/links/${id}`,
  CreateLink: '/links',

  // Users
  GetUser: id => `/users/${id}`,
  GetHashes: id => `/users/${id}/hashes`,

  // Reports
  CreateReport: '/reports',

  // Emojis
  UploadEmojiToGuild: (id, packIndex) => `/emojis/${packIndex !== false ? 'packages/' : ''}${id}/upload-to-guild`,
  IncrementEmojiDownloads: (id, isPack) => `/emojis/${isPack ? 'packages/' : ''}${id}/downloads`,
  GetEmojiMetadata: (id, isPack) => `/emojis/${isPack ? 'packages/' : ''}${id}/metadata`,
  GetEmoji: (id, isPack) => `/emojis/${isPack ? 'packages/' : ''}${id}`,
  FetchEmojis: '/emojis/search',
  DenyEmoji: id => `/emojis/${id}/deny`,
  DeleteEmoji: id => `/emojis/${id}/delete`,
  CreateEmoji: '/emojis',
  ApproveEmoji: id => `/emojis/${id}/approve`,

  // Dashboard
  GetDashboardData: '/dashboard',

  // Quarantines
  DeleteQuarantineRecord: id => `/quarantines/${id}`,
  CreateQuarantine: '/quarantines',

  // Blocked IPs
  DeleteBlockedIP: ip => `/blocked-ips/${ip}`,

  // Bots
  VoteBot: id => `/bots/${id}/vote`,
  SetBotWebhookSettings: id => `/bots/${id}/webhook-settings`,
  RestoreBot: id => `/bot-denies/${id}/restore`,
  DenyBot: id => `/bots/${id}/deny`,
  RemoveExtraOwner: (botId, userId) => `/bots/${botId}/extra-owners/${userId}`,
  GetExtraOwners: id => `/bots/${id}/extra-owners`,
  GetBotMetadata: id => `/bots/${id}/metadata`,
  GetBot: id => `/bots/${id}`,
  FetchBotVoters: id => `/bots/${id}/voters`,
  FetchBotReviews: id => `/bots/${id}/reviews`,
  DeleteBot: id => `/bots/${id}`,
  DeleteBotDenyRecord: id => `/bot-denies/${id}`,
  DeleteBotReview: (botId, reviewId) => `/bots/${botId}/reviews/${reviewId}`,
  DeleteBotTimeout: (botId, userId) => `/bots/${botId}/voters/${userId}/timeout`,
  DeleteBotWebhookSettings: id => `/bots/${id}/webhook-settings`,
  DenyReview: (botId, reviewId) => `/bots/${botId}/reviews/${reviewId}/deny`,
  FetchBots: '/bots/search',
  EditBot: id => `/bots/${id}`,
  DeleteApiKey: id => `/bots/${id}/api-key`,
  CreateBotReview: id => `/bots/${id}/reviews`,
  CreateExtraOwner: botId => `/bots/${botId}/extra-owners`,
  CreateBot: id => `/bots/${id}`,
  CreateApiKey: id => `/bots/${id}/api-key`,
  ApproveBotReview: (botId, reviewId) => `/bots/${botId}/reviews/${reviewId}/approve`,
  ApproveBot: id => `/bots/${id}/approve`,

  // Authentication
  Logout: '/auth/logout',
  GetSoundUploadableGuilds: '/auth/@me/sound-uploadable-guilds',
  GetEmojiUploadableGuilds: '/auth/@me/emoji-uploadable-guilds',
  GetData: '/auth/@me/data',
  GetAuthenticatedUser: '/auth/@me',
  GetApplicationsEntitlementsScopeGranted: '/auth/@me/applications-entitlements-scope-granted',

  // Checkout
  CreateCheckout: '/payments/checkout',

  // Other
  FetchPresences: 'https://lantern.rest/api/v1/users'
};

export default Endpoints;
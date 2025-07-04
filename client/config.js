/* eslint no-duplicate-imports: 0 */ // Disable eslint no-duplicate-imports

import { TiPlus, TiStar, TbBrush, TbCategoryFilled, TbSquareRoundedChevronUp, RiBrush2Fill, RiCommunityFill, RiInstagramFill, RiRobot2Fill, PiWaveformBold, MdDownload, MdEmojiEmotions, MdEvent, MdMenuBook, MdMovieFilter, MdOutlinePhone, MdScience, MdUpdate, IoGameController, IoHeart, IoLanguage, IoMusicalNotesSharp, IoIosChatboxes, ImUser, HiMiniExclamationCircle, HiMiniPaintBrush, HiDesktopComputer, HiNewspaper, HiSortAscending, HiSortDescending, HiTemplate, GiTwoCoins, FaRegImage, FaCat, FaCompass, FaEye, FaGraduationCap, FaLaptopCode, FaShieldAlt, FaUsers, CgProfile, BsStars, BsThreeDots, BiSolidCategory, BiSolidHappy, BiSolidMusic, AiFillSound, AiFillTool } from '@/icons';

const config = {
  availableLocales: [
    {
      name: 'English',
      code: 'en',
      dateFnsKey: 'enUS',
      flag: '🇺🇸',
      default: true,
      countryCode: 'us'
    },
    {
      name: 'Turkish',
      code: 'tr',
      dateFnsKey: 'tr',
      flag: '🇹🇷',
      countryCode: 'tr'
    },
    {
      name: 'Azerbaijani',
      code: 'az',
      dateFnsKey: 'az',
      flag: '🇦🇿',
      countryCode: 'az'
    }
  ],
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://discord.place',
  supportInviteUrl: 'https://invite.discord.place',
  docsUrl: 'https://docs.discord.place',
  statusUrl: 'https://status.discord.place',
  statusBadgeUrl: 'https://status.discord.place/badge',
  api: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.discord.place'
  },
  analytics: {
    url: 'https://plausible.discord.place',
    script: 'https://plausible.discord.place/js/script.pageview-props.file-downloads.hash.outbound-links.js',
    domain: 'discord.place'
  },
  getProfileURL: (slug, preferredHost) => {
    const url = `https://${preferredHost}/${slug}`;

    return url;
  },
  dashboardRequestDelay: 1000,
  headerLinks: [
    {
      id: 'profiles',
      href: '/profiles',
      icon: CgProfile
    },
    {
      id: 'servers',
      href: '/servers',
      icon: FaCompass
    },
    {
      id: 'bots',
      href: '/bots',
      icon: RiRobot2Fill
    },
    {
      id: 'emojis',
      href: '/emojis',
      icon: MdEmojiEmotions
    },
    {
      id: 'templates',
      href: '/templates',
      icon: HiTemplate
    },
    {
      id: 'sounds',
      href: '/sounds',
      icon: PiWaveformBold
    },
    {
      id: 'themes',
      href: '/themes',
      icon: RiBrush2Fill
    },
    {
      id: 'blog',
      icon: HiNewspaper,
      href: '/blogs'
    },
    {
      id: 'premium',
      icon: BsStars,
      href: '/premium'
    }
  ],
  errorMessages: {
    '0': 'An unknown error occurred.',
    '401': 'You are not authorized to view this page.',
    '404': 'The page you are looking for does not exist.',
    '50001': 'You are not authorized to edit this profile.',
    '50002': 'The user who created the profile does not currently have a premium.',
    '60001': 'You are not authorized to edit this server.',
    '70001': 'You are not authorized to edit this bot.',
    '80001': 'The link you are looking for does not exist.',
    '90001': 'The blog you are looking for does not exist.'
  },
  profilesMaxSocialsLength: 8,
  getLoginURL(pathname) {
    return `${this.api.url}/auth/login?redirect=${encodeURIComponent(
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://discord.place') + pathname
    )}`;
  },
  applicationsEntitlementsScopeURL(userId) {
    return `${this.api.url}/auth/applicationsEntitlementsScope?userId=${userId}`;
  },
  validateSlug: function slugValidation(value) {
    return /^(?!-)(?!.*--)(?!.*-$)[a-zA-Z0-9-]{3,32}$/.test(value);
  },
  emojiCategories: [
    'All',
    'Gaming',
    'Anime',
    'Memes',
    'Pepe',
    'Pixel Art',
    'Cute',
    'Logos',
    'Utility',
    'Other',
    'Animated'
  ],
  serverCategories: [
    'All',
    'Gaming',
    'Anime',
    'Public',
    'Community',
    'Music',
    'Art',
    'Programming',
    'Science',
    'Technology',
    'Education',
    'Language',
    'Other'
  ],
  botCategories: [
    'All',
    'Moderation',
    'Utility',
    'Fun & Games',
    'Music',
    'Economy',
    'Roleplay',
    'Technology',
    'Art & Design',
    'Virtual Assistants',
    'Social Media Integration',
    'Anime & Manga',
    'Other'
  ],
  templateCategories: [
    'All',
    'Chat',
    'Design',
    'Music',
    'Education',
    'Gaming',
    'Anime',
    'Tech',
    'Roleplay',
    'Event',
    'Other'
  ],
  soundCategories: [
    'Memes',
    'Loud',
    'NSFW',
    'Other'
  ],
  themeCategories: [
    'Gradient',
    'Light',
    'Dark',
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Pink'
  ],
  emojiMaxCategoriesLength: 4,
  packagesMinEmojisLength: 4,
  packagesMaxEmojisLength: 9,
  serverKeywordsMaxLength: 5,
  serverKeywordsMaxCharacters: 32,
  serverDescriptionMaxCharacters: 256,
  reviewsMaxCharacters: 256,
  reviewsMinCharacters: 64,
  botShortDescriptionMinLength: 16,
  botShortDescriptionMaxLength: 150,
  botDescriptionMinLength: 32,
  botDescriptionMaxLength: 8192,
  templateMaxCategoriesLength: 3,
  templateDescriptionMinLength: 32,
  templateDescriptionMaxLength: 256,
  reportReasonMinCharacters: 32,
  reportReasonMaxCharacters: 4096,
  botMaxExtraOwners: 4,
  botTestGuildId: '1239320384441159751',
  themeSensitiveSocialTypes: ['x', 'custom', 'tiktok', 'github'],
  getEmojiURL: (id, animated) => `${process.env.NEXT_PUBLIC_CDN_URL}/emojis/${id}.${animated ? 'gif' : 'png'}`,
  getSoundURL: id => `${process.env.NEXT_PUBLIC_CDN_URL}/sounds/${id}.mp3`,
  getEmojiIdFromURL: url => {
    const match = url.match(/emojis\/(?:packages\/(?<packageId>[a-zA-Z0-9-]+)\/)?(?<emojiId>[a-zA-Z0-9-]+)\.(?<type>gif|png)/);
    if (!match) return null;

    return match.groups.packageId;
  },
  botInviteURL: 'https://bot.discord.place',
  botCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Moderation': <FaShieldAlt />,
    'Utility': <AiFillTool />,
    'Fun & Games': <BiSolidHappy />,
    'Music': <IoMusicalNotesSharp />,
    'Economy': <GiTwoCoins />,
    'Roleplay': <ImUser />,
    'Technology': <HiDesktopComputer />,
    'Art & Design': <HiMiniPaintBrush />,
    'Virtual Assistants': <RiRobot2Fill />,
    'Social Media Integration': <RiInstagramFill />,
    'Anime & Manga': <MdMenuBook />,
    'Other': <TiPlus />
  },
  serverCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Gaming': <IoGameController />,
    'Anime': <MdMovieFilter />,
    'Public': <FaCompass />,
    'Community': <RiCommunityFill />,
    'Music': <BiSolidMusic />,
    'Art': <TbBrush />,
    'Programming': <FaLaptopCode />,
    'Science': <MdScience />,
    'Technology': <MdOutlinePhone />,
    'Education': <FaGraduationCap />,
    'Language': <IoLanguage />,
    'Other': <BsThreeDots />
  },
  emojiCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Gaming': <IoGameController />,
    'Anime': <MdMovieFilter />,
    'Memes': <MdEmojiEmotions />,
    'Pepe': <MdEmojiEmotions />,
    'Pixel Art': <TbBrush />,
    'Cute': <FaCat />,
    'Logos': <TbCategoryFilled />,
    'Utility': <AiFillTool />,
    'Other': <BsThreeDots />,
    'Animated': <FaRegImage />
  },
  templateCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Chat': <IoIosChatboxes />,
    'Design': <TbBrush />,
    'Music': <IoMusicalNotesSharp />,
    'Education': <FaGraduationCap />,
    'Gaming': <IoGameController />,
    'Anime': <MdMovieFilter />,
    'Tech': <HiDesktopComputer />,
    'Roleplay': <ImUser />,
    'Event': <MdEvent />,
    'Other': <BsThreeDots />
  },
  soundCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Memes': <MdEmojiEmotions />,
    'Loud': <AiFillSound />,
    'NSFW': <HiMiniExclamationCircle />,
    'Other': <BsThreeDots />
  },
  themeCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Gradient': <span className='block size-[14px] rounded-full bg-gradient-to-r from-pink-400 to-purple-500' />,
    'Light': <span className='block size-[14px] rounded-full bg-white' />,
    'Dark': <span className='block size-[14px] rounded-full bg-black' />,
    'Red': <span className='block size-[14px] rounded-full bg-red-500' />,
    'Orange': <span className='block size-[14px] rounded-full bg-orange-500' />,
    'Yellow': <span className='block size-[14px] rounded-full bg-yellow-500' />,
    'Green': <span className='block size-[14px] rounded-full bg-green-500' />,
    'Blue': <span className='block size-[14px] rounded-full bg-blue-500' />,
    'Purple': <span className='block size-[14px] rounded-full bg-purple-500' />,
    'Pink': <span className='block size-[14px] rounded-full bg-pink-500' />
  },
  sortIcons: {
    'Servers': <FaCompass />,
    'Votes': <TbSquareRoundedChevronUp />,
    'LatestVoted': <MdUpdate />,
    'Members': <FaUsers />,
    'Newest': <HiSortAscending />,
    'Oldest': <HiSortDescending />,
    'Boosts': <TiStar />,
    'MostReviewed': <TiStar />,
    'Popular': <TiStar />,
    'Downloads': <MdDownload />,
    'Likes': <IoHeart />,
    'MostViewed': <FaEye />
  },
  discordWebhookRegex: /^https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/,
  githubIssuesUrl: 'https://github.com/discordplace/discord.place/issues/new?template=bug-report---feature-request.md',
  customHostnames: ['dsc.lat', 'dsc.gay', 'dsc.wtf', 'dsc.baby'],
  emojisDenyReasons: {
    'reposted-emoji': {
      name: 'Reposted Emoji',
      description: 'If the emoji you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.'
    },
    'background-transparency': {
      name: 'Background Transparency',
      description: 'Emojis should feature a transparent background. Emojis with opaque backgrounds may not blend well with different message backgrounds and could disrupt visual coherence.'
    },
    'whitespace': {
      name: 'Whitespace',
      description: 'Emojis containing excess whitespace around the edges may appear disproportionately small when used in messages. To ensure optimal visibility and legibility, please crop your emojis appropriately before submission.'
    },
    'incoherent-emoji-package-content': {
      name: 'Incoherent Emoji Package Content',
      description: 'Emojis within a package must be compatible with each other to ensure coherence and meaningful usage.'
    },
    'offensive-or-inappropriate-content': {
      name: 'Offensive or Inappropriate Content',
      description: 'Emojis depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.'
    },
    'copyright-infringement': {
      name: 'Copyright Infringement',
      description: 'Ensure that your emoji submissions do not violate any copyright or intellectual property rights. Avoid using copyrighted characters, logos, or designs without proper authorization.'
    },
    'clear-representation': {
      name: 'Clear Representation',
      description: 'Emojis should clearly represent their intended concept or object. Avoid submitting emojis that are overly abstract or ambiguous, as they may cause confusion or misinterpretation among users.'
    }
  },
  botsDenyReasons: {
    'reposted-bot': {
      name: 'Reposted Bot',
      description: 'If the bot you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.'
    },
    'offensive-or-inappropriate-content': {
      name: 'Offensive or Inappropriate Content',
      description: 'Bots depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.'
    },
    'against-discord-terms-of-service': {
      name: 'Against Discord Terms of Service',
      description: 'Bots that violate Discord\'s Terms of Service will not be accepted.'
    },
    'not-online-or-inviteable': {
      name: 'Not Online or Inviteable',
      description: 'Bots must be online and inviteable for usage.'
    },
    'base-functionality-is-broken': {
      name: 'Base Functionality is Broken',
      description: 'Bots must have functional base features to be considered.'
    },
    'copied-bot': {
      name: 'Copied Bot',
      description: 'Bots that are direct copies of existing bots will not be accepted.'
    },
    'has-vulnerability': {
      name: 'Has Vulnerability',
      description: 'Bots with security vulnerabilities will not be accepted.'
    },
    'support-for-slash-commands': {
      name: 'Support for Slash Commands',
      description: 'Bots must support slash commands for improved user experience and functionality.'
    },
    'misleading-or-inaccurate-information': {
      name: 'Misleading or Inaccurate Information',
      description: 'Bot with misleading descriptions or information may be removed. Provide clear and accurate details about your bot\'s purpose and content.'
    }
  },
  templatesDenyReasons: {
    'duplicate-template': {
      name: 'Duplicate Template',
      description: 'If the template you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.'
    },
    'offensive-or-inappropriate-content': {
      name: 'Offensive or Inappropriate Content',
      description: 'Templates featuring offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Ensure your template is suitable for a wide audience and respectful of diverse backgrounds and cultures.'
    },
    'against-discord-terms-of-service': {
      name: 'Against Discord Terms of Service',
      description: 'Templates that violate Discord\'s Terms of Service will not be accepted.'
    },
    'poor-quality-or-incomplete-template': {
      name: 'Poor Quality or Incomplete Template',
      description: 'Templates should be well-organized and complete. Submissions with poor structure, missing key elements, or that are not user-friendly may be rejected.'
    },
    'misleading-or-inaccurate-information': {
      name: 'Misleading or Inaccurate Information',
      description: 'Templates with misleading titles, descriptions, or information may be rejected. Provide clear and accurate details about your template\'s purpose and features.'
    },
    'lacks-clear-focus-or-purpose': {
      name: 'Advertising and Self-Promotion',
      description: 'Templates primarily focused on advertising or self-promotion without providing genuine value to users may not be accepted.'
    },
    'quality-and-presentation': {
      name: 'Quality and Presentation',
      description: 'Templates should be well-organized and present a professional appearance. Low-quality or poorly managed templates may not be accepted.'
    },
    'proper-categorization': {
      name: 'Proper Categorization',
      description: 'Ensure your template is categorized correctly. Misleading categorization can result in rejection.'
    }
  },
  soundsDenyReasons: {
    'offensive-or-inappropriate-content': {
      name: 'Offensive or Inappropriate Content',
      description: 'Sounds featuring offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Ensure your sound is suitable for a wide audience and respectful of diverse backgrounds and cultures.'
    },
    'poor-quality-or-incomplete-sound': {
      name: 'Poor Quality or Incomplete Sound',
      description: 'Sounds should be clear, high-quality, and complete. Submissions with poor audio quality, missing key elements, or that are not user-friendly may be rejected.'
    },
    'misleading-or-inaccurate-information': {
      name: 'Misleading or Inaccurate Information',
      description: 'Sounds with misleading titles may be rejected. Provide clear and accurate details about your sound\'s purpose and content.'
    },
    'lacks-clear-focus-or-purpose': {
      name: 'Lacks Clear Focus or Purpose',
      description: 'Sounds should have a clear focus or purpose. Submissions that are overly broad or lack a specific theme may not be accepted.'
    },
    'advertising-and-self-promotion': {
      name: 'Advertising and Self-Promotion',
      description: 'Sounds primarily focused on advertising or self-promotion without providing genuine value to users may not be accepted.'
    },
    'proper-categorization': {
      name: 'Proper Categorization',
      description: 'Ensure your sound is categorized correctly. Misleading categorization can result in rejection.'
    },
    'sound-length': {
      name: 'Sound Length',
      description: 'Sounds should be of appropriate length. Extremely short or excessively long sounds may not be accepted.'
    },
    'sound-volume': {
      name: 'Sound Volume',
      description: 'Sounds should be of appropriate volume. Extremely loud or quiet sounds may not be accepted.'
    },
    'sound-licensing': {
      name: 'Sound Licensing',
      description: 'Ensure your sound does not violate any copyright or intellectual property rights. Avoid using copyrighted audio, music, or sound effects without proper authorization.'
    }
  },
  themesDenyReasons: {
    'proper-categorization': {
      name: 'Proper Categorization',
      description: 'Ensure your theme is categorized correctly. Misleading categorization can result in rejection.'
    }
  },
  quarantineRestrictions: {
    'PROFILES_CREATE': {
      available_to: ['USER_ID'],
      description: 'Creating profiles.'
    },
    'PROFILES_LIKE': {
      available_to: ['USER_ID'],
      description: 'Liking profiles.'
    },
    'EMOJIS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Publishing emojis.'
    },
    'EMOJIS_QUICKLY_UPLOAD': {
      available_to: ['USER_ID'],
      description: 'Uploading emojis.'
    },
    'SERVERS_CREATE': {
      available_to: ['USER_ID', 'GUILD_ID'],
      description: 'Listing servers.'
    },
    'SERVERS_CREATE_REVIEW': {
      available_to: ['USER_ID'],
      description: 'Reviewing servers.'
    },
    'SERVERS_VOTE': {
      available_to: ['USER_ID', 'GUILD_ID'],
      description: 'Voting on servers.'
    },
    'BOTS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing bots.'
    },
    'BOTS_VOTE': {
      available_to: ['USER_ID'],
      description: 'Voting on bots.'
    },
    'BOTS_CREATE_REVIEW': {
      available_to: ['USER_ID'],
      description: 'Reviewing bots.'
    },
    'BOTS_CREATE_API_KEY': {
      available_to: ['USER_ID'],
      description: 'Creating bot API keys.'
    },
    'TEMPLATES_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing templates.'
    },
    'TEMPLATES_USE': {
      available_to: ['USER_ID', 'GUILD_ID'],
      description: 'Using templates.'
    },
    'SOUNDS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing sounds.'
    },
    'SOUNDS_LIKE': {
      available_to: ['USER_ID'],
      description: 'Liking sounds.'
    },
    'REPORTS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Creating reports.'
    },
    'LOGIN': {
      available_to: ['USER_ID'],
      description: 'Logging in.'
    },
    'THEMES_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing themes.'
    }
  },
  socialNames: {
    instagram: 'Instagram',
    x: 'X',
    twitter: 'Twitter',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    steam: 'Steam',
    github: 'GitHub',
    twitch: 'Twitch',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    gitlab: 'GitLab',
    reddit: 'Reddit',
    mastodon: 'Mastodon',
    bluesky: 'Bluesky'
  }
};

export default config;
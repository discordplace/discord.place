/* eslint no-duplicate-imports: 0 */ // Disable eslint no-duplicate-imports

import { AiFillSound, AiFillTool } from 'react-icons/ai';
import { BiSolidCategory, BiSolidHappy, BiSolidMusic } from 'react-icons/bi';
import { BsStars, BsThreeDots } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FaCat, FaCompass, FaEye, FaGraduationCap, FaLaptopCode, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { FaRegImage } from 'react-icons/fa6';
import { GiTwoCoins } from 'react-icons/gi';
import { HiDesktopComputer, HiNewspaper, HiSortAscending, HiSortDescending } from 'react-icons/hi';
import { HiTemplate } from 'react-icons/hi';
import { HiMiniExclamationCircle, HiMiniPaintBrush } from 'react-icons/hi2';
import { ImUser } from 'react-icons/im';
import { IoIosChatboxes } from 'react-icons/io';
import { IoGameController, IoHeart, IoLanguage, IoMusicalNotesSharp } from 'react-icons/io5';
import { MdDownload, MdEmojiEmotions, MdEvent, MdMovieFilter, MdOutlinePhone, MdScience, MdUpdate } from 'react-icons/md';
import { MdMenuBook } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiBrush2Fill, RiCommunityFill, RiRobot2Fill } from 'react-icons/ri';
import { RiInstagramFill } from 'react-icons/ri';
import { TbBrush, TbCategoryFilled, TbSquareRoundedChevronUp } from 'react-icons/tb';
import { TiPlus, TiStar } from 'react-icons/ti';

const config = {
  analytics: {
    domains: ['discord.place', 'www.discord.place'],
    script: 'https://analytics.discord.place/script.js',
    url: 'https://analytics.discord.place',
    websiteId: 'b8fea5b8-7789-4381-97a0-0b474d9bb87a'
  },
  api: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.discord.place'
  },
  availableLocales: [
    {
      code: 'en',
      dateFnsKey: 'enUS',
      default: true,
      flag: '🇺🇸',
      name: 'English'
    },
    {
      code: 'tr',
      dateFnsKey: 'tr',
      flag: '🇹🇷',
      name: 'Turkish'
    },
    {
      code: 'az',
      dateFnsKey: 'az',
      flag: '🇦🇿',
      name: 'Azerbaijani'
    }
  ],
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://discord.place',
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
  botCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Anime & Manga': <MdMenuBook />,
    'Art & Design': <HiMiniPaintBrush />,
    'Economy': <GiTwoCoins />,
    'Fun & Games': <BiSolidHappy />,
    'Moderation': <FaShieldAlt />,
    'Music': <IoMusicalNotesSharp />,
    'Other': <TiPlus />,
    'Roleplay': <ImUser />,
    'Social Media Integration': <RiInstagramFill />,
    'Technology': <HiDesktopComputer />,
    'Utility': <AiFillTool />,
    'Virtual Assistants': <RiRobot2Fill />
  },
  botDescriptionMaxLength: 2048,
  botDescriptionMinLength: 32,
  botInviteURL: 'https://bot.discord.place',
  botMaxExtraOwners: 4,
  botsDenyReasons: {
    'against-discord-terms-of-service': {
      description: 'Bots that violate Discord\'s Terms of Service will not be accepted.',
      name: 'Against Discord Terms of Service'
    },
    'base-functionality-is-broken': {
      description: 'Bots must have functional base features to be considered.',
      name: 'Base Functionality is Broken'
    },
    'copied-bot': {
      description: 'Bots that are direct copies of existing bots will not be accepted.',
      name: 'Copied Bot'
    },
    'has-vulnerability': {
      description: 'Bots with security vulnerabilities will not be accepted.',
      name: 'Has Vulnerability'
    },
    'misleading-or-inaccurate-information': {
      description: 'Bot with misleading descriptions or information may be removed. Provide clear and accurate details about your bot\'s purpose and content.',
      name: 'Misleading or Inaccurate Information'
    },
    'not-online-or-inviteable': {
      description: 'Bots must be online and inviteable for usage.',
      name: 'Not Online or Inviteable'
    },
    'offensive-or-inappropriate-content': {
      description: 'Bots depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.',
      name: 'Offensive or Inappropriate Content'
    },
    'reposted-bot': {
      description: 'If the bot you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.',
      name: 'Reposted Bot'
    },
    'support-for-slash-commands': {
      description: 'Bots must support slash commands for improved user experience and functionality.',
      name: 'Support for Slash Commands'
    }
  },
  botShortDescriptionMaxLength: 150,
  botShortDescriptionMinLength: 16,
  botTestGuildId: '1239320384441159751',
  customHostnames: ['dsc.wtf', 'dsc.dog', 'dsc.mom'],
  dashboardRequestDelay: 1000,
  docsUrl: 'https://docs.discord.place',
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
  emojiCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Animated': <FaRegImage />,
    'Anime': <MdMovieFilter />,
    'Cute': <FaCat />,
    'Gaming': <IoGameController />,
    'Logos': <TbCategoryFilled />,
    'Memes': <MdEmojiEmotions />,
    'Other': <BsThreeDots />,
    'Pepe': <MdEmojiEmotions />,
    'Pixel Art': <TbBrush />,
    'Utility': <AiFillTool />
  },
  emojiMaxCategoriesLength: 4,
  emojisDenyReasons: {
    'background-transparency': {
      description: 'Emojis should feature a transparent background. Emojis with opaque backgrounds may not blend well with different message backgrounds and could disrupt visual coherence.',
      name: 'Background Transparency'
    },
    'clear-representation': {
      description: 'Emojis should clearly represent their intended concept or object. Avoid submitting emojis that are overly abstract or ambiguous, as they may cause confusion or misinterpretation among users.',
      name: 'Clear Representation'
    },
    'copyright-infringement': {
      description: 'Ensure that your emoji submissions do not violate any copyright or intellectual property rights. Avoid using copyrighted characters, logos, or designs without proper authorization.',
      name: 'Copyright Infringement'
    },
    'incoherent-emoji-package-content': {
      description: 'Emojis within a package must be compatible with each other to ensure coherence and meaningful usage.',
      name: 'Incoherent Emoji Package Content'
    },
    'offensive-or-inappropriate-content': {
      description: 'Emojis depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.',
      name: 'Offensive or Inappropriate Content'
    },
    'reposted-emoji': {
      description: 'If the emoji you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.',
      name: 'Reposted Emoji'
    },
    'whitespace': {
      description: 'Emojis containing excess whitespace around the edges may appear disproportionately small when used in messages. To ensure optimal visibility and legibility, please crop your emojis appropriately before submission.',
      name: 'Whitespace'
    }
  },
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
  getEmojiIdFromURL: url => {
    const match = url.match(/emojis\/(?:packages\/(?<packageId>[a-zA-Z0-9-]+)\/)?(?<emojiId>[a-zA-Z0-9-]+)\.(?<type>gif|png)/);
    if (!match) return null;

    return match.groups.packageId;
  },
  getEmojiURL: (id, animated) => `https://cdn.discord.place/emojis/${id}.${animated ? 'gif' : 'png'}`,
  getLoginURL (pathname) {
    return `${this.api.url}/auth/login?redirect=${encodeURIComponent(
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://discord.place') + pathname
    )}`;
  },
  getProfileURL: (slug, preferredHost) => {
    const url = `https://${preferredHost}/${slug}`;

    return url;
  },
  getSoundURL: id => `https://cdn.discord.place/sounds/${id}.mp3`,
  headerLinks: [
    {
      href: '/profiles',
      icon: CgProfile,
      id: 'profiles'
    },
    {
      href: '/servers',
      icon: FaCompass,
      id: 'servers'
    },
    {
      href: '/bots',
      icon: RiRobot2Fill,
      id: 'bots'
    },
    {
      href: '/emojis',
      icon: MdEmojiEmotions,
      id: 'emojis'
    },
    {
      href: '/templates',
      icon: HiTemplate,
      id: 'templates'
    },
    {
      href: '/sounds',
      icon: PiWaveformBold,
      id: 'sounds'
    },
    {
      href: '/themes',
      icon: RiBrush2Fill,
      id: 'themes'
    },
    {
      href: '/blogs',
      icon: HiNewspaper,
      id: 'blog'
    },
    {
      href: '/premium',
      icon: BsStars,
      id: 'premium'
    }
  ],
  packagesMaxEmojisLength: 9,
  packagesMinEmojisLength: 4,
  profilesMaxSocialsLength: 8,
  quarantineRestrictions: {
    'BOTS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing bots.'
    },
    'BOTS_CREATE_API_KEY': {
      available_to: ['USER_ID'],
      description: 'Creating bot API keys.'
    },
    'BOTS_CREATE_REVIEW': {
      available_to: ['USER_ID'],
      description: 'Reviewing bots.'
    },
    'BOTS_VOTE': {
      available_to: ['USER_ID'],
      description: 'Voting on bots.'
    },
    'EMOJIS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Publishing emojis.'
    },
    'EMOJIS_QUICKLY_UPLOAD': {
      available_to: ['USER_ID'],
      description: 'Uploading emojis.'
    },
    'LOGIN': {
      available_to: ['USER_ID'],
      description: 'Logging in.'
    },
    'PROFILES_CREATE': {
      available_to: ['USER_ID'],
      description: 'Creating profiles.'
    },
    'PROFILES_LIKE': {
      available_to: ['USER_ID'],
      description: 'Liking profiles.'
    },
    'REPORTS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Creating reports.'
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
    'SOUNDS_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing sounds.'
    },
    'SOUNDS_LIKE': {
      available_to: ['USER_ID'],
      description: 'Liking sounds.'
    },
    'TEMPLATES_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing templates.'
    },
    'TEMPLATES_USE': {
      available_to: ['USER_ID', 'GUILD_ID'],
      description: 'Using templates.'
    },
    'THEMES_CREATE': {
      available_to: ['USER_ID'],
      description: 'Listing themes.'
    }
  },
  reportReasonMaxCharacters: 4096,
  reportReasonMinCharacters: 32,
  reviewsMaxCharacters: 256,
  reviewsMinCharacters: 64,
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
  serverCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Anime': <MdMovieFilter />,
    'Art': <TbBrush />,
    'Community': <RiCommunityFill />,
    'Education': <FaGraduationCap />,
    'Gaming': <IoGameController />,
    'Language': <IoLanguage />,
    'Music': <BiSolidMusic />,
    'Other': <BsThreeDots />,
    'Programming': <FaLaptopCode />,
    'Public': <FaCompass />,
    'Science': <MdScience />,
    'Technology': <MdOutlinePhone />
  },
  serverDescriptionMaxCharacters: 256,
  serverKeywordsMaxCharacters: 32,
  serverKeywordsMaxLength: 5,
  sortIcons: {
    'Boosts': <TiStar />,
    'Downloads': <MdDownload />,
    'LatestVoted': <MdUpdate />,
    'Likes': <IoHeart />,
    'Members': <FaUsers />,
    'MostReviewed': <TiStar />,
    'MostViewed': <FaEye />,
    'Newest': <HiSortAscending />,
    'Oldest': <HiSortDescending />,
    'Popular': <TiStar />,
    'Servers': <FaCompass />,
    'Votes': <TbSquareRoundedChevronUp />
  },
  soundCategories: [
    'Memes',
    'Loud',
    'NSFW',
    'Other'
  ],
  soundCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Loud': <AiFillSound />,
    'Memes': <MdEmojiEmotions />,
    'NSFW': <HiMiniExclamationCircle />,
    'Other': <BsThreeDots />
  },
  soundsDenyReasons: {
    'advertising-and-self-promotion': {
      description: 'Sounds primarily focused on advertising or self-promotion without providing genuine value to users may not be accepted.',
      name: 'Advertising and Self-Promotion'
    },
    'lacks-clear-focus-or-purpose': {
      description: 'Sounds should have a clear focus or purpose. Submissions that are overly broad or lack a specific theme may not be accepted.',
      name: 'Lacks Clear Focus or Purpose'
    },
    'misleading-or-inaccurate-information': {
      description: 'Sounds with misleading titles may be rejected. Provide clear and accurate details about your sound\'s purpose and content.',
      name: 'Misleading or Inaccurate Information'
    },
    'offensive-or-inappropriate-content': {
      description: 'Sounds featuring offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Ensure your sound is suitable for a wide audience and respectful of diverse backgrounds and cultures.',
      name: 'Offensive or Inappropriate Content'
    },
    'poor-quality-or-incomplete-sound': {
      description: 'Sounds should be clear, high-quality, and complete. Submissions with poor audio quality, missing key elements, or that are not user-friendly may be rejected.',
      name: 'Poor Quality or Incomplete Sound'
    },
    'proper-categorization': {
      description: 'Ensure your sound is categorized correctly. Misleading categorization can result in rejection.',
      name: 'Proper Categorization'
    },
    'sound-length': {
      description: 'Sounds should be of appropriate length. Extremely short or excessively long sounds may not be accepted.',
      name: 'Sound Length'
    },
    'sound-licensing': {
      description: 'Ensure your sound does not violate any copyright or intellectual property rights. Avoid using copyrighted audio, music, or sound effects without proper authorization.',
      name: 'Sound Licensing'
    },
    'sound-volume': {
      description: 'Sounds should be of appropriate volume. Extremely loud or quiet sounds may not be accepted.',
      name: 'Sound Volume'
    }
  },
  statusBadgeUrl: 'https://status.discord.place/badge',
  statusUrl: 'https://status.discord.place',
  supportInviteUrl: 'https://invite.discord.place',
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
  templateCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Anime': <MdMovieFilter />,
    'Chat': <IoIosChatboxes />,
    'Design': <TbBrush />,
    'Education': <FaGraduationCap />,
    'Event': <MdEvent />,
    'Gaming': <IoGameController />,
    'Music': <IoMusicalNotesSharp />,
    'Other': <BsThreeDots />,
    'Roleplay': <ImUser />,
    'Tech': <HiDesktopComputer />
  },
  templateDescriptionMaxLength: 256,
  templateDescriptionMinLength: 32,
  templateMaxCategoriesLength: 3,
  templatesDenyReasons: {
    'against-discord-terms-of-service': {
      description: 'Templates that violate Discord\'s Terms of Service will not be accepted.',
      name: 'Against Discord Terms of Service'
    },
    'duplicate-template': {
      description: 'If the template you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.',
      name: 'Duplicate Template'
    },
    'lacks-clear-focus-or-purpose': {
      description: 'Templates primarily focused on advertising or self-promotion without providing genuine value to users may not be accepted.',
      name: 'Advertising and Self-Promotion'
    },
    'misleading-or-inaccurate-information': {
      description: 'Templates with misleading titles, descriptions, or information may be rejected. Provide clear and accurate details about your template\'s purpose and features.',
      name: 'Misleading or Inaccurate Information'
    },
    'offensive-or-inappropriate-content': {
      description: 'Templates featuring offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Ensure your template is suitable for a wide audience and respectful of diverse backgrounds and cultures.',
      name: 'Offensive or Inappropriate Content'
    },
    'poor-quality-or-incomplete-template': {
      description: 'Templates should be well-organized and complete. Submissions with poor structure, missing key elements, or that are not user-friendly may be rejected.',
      name: 'Poor Quality or Incomplete Template'
    },
    'proper-categorization': {
      description: 'Ensure your template is categorized correctly. Misleading categorization can result in rejection.',
      name: 'Proper Categorization'
    },
    'quality-and-presentation': {
      description: 'Templates should be well-organized and present a professional appearance. Low-quality or poorly managed templates may not be accepted.',
      name: 'Quality and Presentation'
    }
  },
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
  themeCategoriesIcons: {
    'All': <BiSolidCategory />,
    'Blue': <span className='block size-[14px] rounded-full bg-blue-500' />,
    'Dark': <span className='block size-[14px] rounded-full bg-black' />,
    'Gradient': <span className='block size-[14px] rounded-full bg-gradient-to-r from-pink-400 to-purple-500' />,
    'Green': <span className='block size-[14px] rounded-full bg-green-500' />,
    'Light': <span className='block size-[14px] rounded-full bg-white' />,
    'Orange': <span className='block size-[14px] rounded-full bg-orange-500' />,
    'Pink': <span className='block size-[14px] rounded-full bg-pink-500' />,
    'Purple': <span className='block size-[14px] rounded-full bg-purple-500' />,
    'Red': <span className='block size-[14px] rounded-full bg-red-500' />,
    'Yellow': <span className='block size-[14px] rounded-full bg-yellow-500' />
  },
  themesDenyReasons: {
    'proper-categorization': {
      description: 'Ensure your theme is categorized correctly. Misleading categorization can result in rejection.',
      name: 'Proper Categorization'
    }
  },
  themeSensitiveSocialTypes: ['x', 'custom', 'tiktok', 'github'],
  validateSlug: function slugValidation(value) {
    return /^(?!-)(?!.*--)(?!.*-$)[a-zA-Z0-9-]{3,32}$/.test(value);
  }
};

export default config;

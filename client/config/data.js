import { AiFillSound, AiFillTool } from 'react-icons/ai';
import { BiSolidCategory, BiSolidHappy, BiSolidMusic } from 'react-icons/bi';
import { BsStars, BsThreeDots } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FaCat, FaCompass, FaEye, FaGraduationCap, FaLaptopCode, FaRegImage, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';
import { HiDesktopComputer, HiNewspaper, HiSortAscending, HiSortDescending, HiTemplate } from 'react-icons/hi';
import { HiMiniExclamationCircle, HiMiniPaintBrush } from 'react-icons/hi2';
import { ImUser } from 'react-icons/im';
import { IoIosChatboxes } from 'react-icons/io';
import { IoGameController, IoHeart, IoLanguage, IoMusicalNotesSharp } from 'react-icons/io5';
import { MdDownload, MdEmojiEmotions, MdEvent, MdMenuBook, MdMovieFilter, MdOutlinePhone, MdScience, MdUpdate } from 'react-icons/md';
import { PiWaveformBold } from 'react-icons/pi';
import { RiBrush2Fill, RiCommunityFill, RiInstagramFill, RiRobot2Fill } from 'react-icons/ri';
import { TbBrush, TbCategoryFilled, TbSquareRoundedChevronUp } from 'react-icons/tb';
import { TiPlus, TiStar } from 'react-icons/ti';

const availableLocales = [
  { code: 'en', countryCode: 'us', dateFnsKey: 'enUS', default: true, flag: '🇺🇸', name: 'English' },
  { code: 'tr', countryCode: 'tr', dateFnsKey: 'tr', flag: '🇹🇷', name: 'Turkish' },
  { code: 'az', countryCode: 'az', dateFnsKey: 'az', flag: '🇦🇿', name: 'Azerbaijani' }
];

const isDev = process.env.NODE_ENV === 'development';

const baseUrl = isDev ? 'http://localhost:36706' : 'https://discord.place';
const supportInviteUrl = 'https://invite.discord.place';
const docsUrl = 'https://docs.discord.place';
const statusUrl = 'https://status.discord.place';
const statusBadgeUrl = 'https://status.discord.place/badge';
const botInviteURL = 'https://bot.discord.place';
const githubIssuesUrl = 'https://github.com/discordplace/discord.place/issues/new?template=bug-report---feature-request.md';

const api = {
  url: isDev ? 'http://localhost:16540' : 'https://api.discord.place'
};

const analytics = {
  recorderScript: 'https://analytics.skyhan.cloud/recorder.js',
  script: 'https://analytics.skyhan.cloud/script.js',
  websiteId: 'ab6a730b-372e-4821-a4da-a8fcc32a76e9'
};

const openreplay = {
  ingestPoint: 'https://openreplay.discord.place/ingest',
  projectKey: 'uNGLYSNRpxpW5S50hKYP'
};

const headerLinks = [
  { href: '/profiles', icon: CgProfile, id: 'profiles' },
  { href: '/servers', icon: FaCompass, id: 'servers' },
  { href: '/bots', icon: RiRobot2Fill, id: 'bots' },
  { href: '/emojis', icon: MdEmojiEmotions, id: 'emojis' },
  { href: '/templates', icon: HiTemplate, id: 'templates' },
  { href: '/sounds', icon: PiWaveformBold, id: 'sounds' },
  { href: '/themes', icon: RiBrush2Fill, id: 'themes' },
  { href: '/blogs', icon: HiNewspaper, id: 'blog' },
  { href: '/premium', icon: BsStars, id: 'premium' }
];

const emojiCategories = [ 'All', 'Gaming', 'Anime', 'Memes', 'Pepe', 'Pixel Art', 'Cute', 'Logos', 'Utility', 'Other', 'Animated' ];
const serverCategories = [ 'All', 'Gaming', 'Anime', 'Public', 'Community', 'Music', 'Art', 'Programming', 'Science', 'Technology', 'Education', 'Language', 'Other' ];
const botCategories = [ 'All', 'Moderation', 'Utility', 'Fun & Games', 'Music', 'Economy', 'Roleplay', 'Technology', 'Art & Design', 'Virtual Assistants', 'Social Media Integration', 'Anime & Manga', 'Other' ];
const templateCategories = [ 'All', 'Chat', 'Design', 'Music', 'Education', 'Gaming', 'Anime', 'Tech', 'Roleplay', 'Event', 'Other' ];
const soundCategories = [ 'Memes', 'Loud', 'NSFW', 'Other' ];
const themeCategories = [ 'Gradient', 'Light', 'Dark', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ];

const botCategoriesIcons = {
  'All': <BiSolidCategory />, 'Anime & Manga': <MdMenuBook />, 'Art & Design': <HiMiniPaintBrush />,
  'Economy': <GiTwoCoins />, 'Fun & Games': <BiSolidHappy />, 'Moderation': <FaShieldAlt />,
  'Music': <IoMusicalNotesSharp />, 'Other': <TiPlus />, 'Roleplay': <ImUser />,
  'Social Media Integration': <RiInstagramFill />, 'Technology': <HiDesktopComputer />,
  'Utility': <AiFillTool />, 'Virtual Assistants': <RiRobot2Fill />
};

const serverCategoriesIcons = {
  'All': <BiSolidCategory />, 'Anime': <MdMovieFilter />, 'Art': <TbBrush />,
  'Community': <RiCommunityFill />, 'Education': <FaGraduationCap />, 'Gaming': <IoGameController />,
  'Language': <IoLanguage />, 'Music': <BiSolidMusic />, 'Other': <BsThreeDots />,
  'Programming': <FaLaptopCode />, 'Public': <FaCompass />, 'Science': <MdScience />,
  'Technology': <MdOutlinePhone />
};

const emojiCategoriesIcons = {
  'All': <BiSolidCategory />, 'Animated': <FaRegImage />, 'Anime': <MdMovieFilter />,
  'Cute': <FaCat />, 'Gaming': <IoGameController />, 'Logos': <TbCategoryFilled />,
  'Memes': <MdEmojiEmotions />, 'Other': <BsThreeDots />, 'Pepe': <MdEmojiEmotions />,
  'Pixel Art': <TbBrush />, 'Utility': <AiFillTool />
};

const templateCategoriesIcons = {
  'All': <BiSolidCategory />, 'Anime': <MdMovieFilter />, 'Chat': <IoIosChatboxes />,
  'Design': <TbBrush />, 'Education': <FaGraduationCap />, 'Event': <MdEvent />,
  'Gaming': <IoGameController />, 'Music': <IoMusicalNotesSharp />, 'Other': <BsThreeDots />,
  'Roleplay': <ImUser />, 'Tech': <HiDesktopComputer />
};

const soundCategoriesIcons = {
  'All': <BiSolidCategory />, 'Loud': <AiFillSound />, 'Memes': <MdEmojiEmotions />,
  'NSFW': <HiMiniExclamationCircle />, 'Other': <BsThreeDots />
};

const themeCategoriesIcons = {
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
};

const sortIcons = {
  'Boosts': <TiStar />, 'Downloads': <MdDownload />, 'LatestVoted': <MdUpdate />,
  'Likes': <IoHeart />, 'Members': <FaUsers />, 'MostReviewed': <TiStar />,
  'MostViewed': <FaEye />, 'Newest': <HiSortAscending />, 'Oldest': <HiSortDescending />,
  'Popular': <TiStar />, 'Servers': <FaCompass />, 'Votes': <TbSquareRoundedChevronUp />
};

const profilesMaxSocialsLength = 8;
const emojiMaxCategoriesLength = 4;
const packagesMinEmojisLength = 4;
const packagesMaxEmojisLength = 9;
const serverKeywordsMaxLength = 5;
const serverKeywordsMaxCharacters = 32;
const serverDescriptionMaxCharacters = 256;
const reviewsMaxCharacters = 256;
const reviewsMinCharacters = 64;
const botShortDescriptionMinLength = 16;
const botShortDescriptionMaxLength = 150;
const botDescriptionMinLength = 32;
const botDescriptionMaxLength = 8192;
const templateMaxCategoriesLength = 3;
const templateDescriptionMinLength = 32;
const templateDescriptionMaxLength = 256;
const reportReasonMinCharacters = 32;
const reportReasonMaxCharacters = 4096;
const botMaxExtraOwners = 4;
const botTestGuildId = '1239320384441159751';
const dashboardRequestDelay = 1000;

const themeSensitiveSocialTypes = [ 'x', 'custom', 'tiktok', 'github' ];
const discordWebhookRegex = /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;
const customHostnames = [ 'dsc.mom', 'dsc.wtf', 'dsc.baby' ];

const socialNames = {
  bluesky: 'Bluesky', facebook: 'Facebook', github: 'GitHub', gitlab: 'GitLab',
  instagram: 'Instagram', linkedin: 'LinkedIn', mastodon: 'Mastodon', reddit: 'Reddit',
  steam: 'Steam', tiktok: 'TikTok', twitch: 'Twitch', twitter: 'Twitter',
  x: 'X', youtube: 'YouTube'
};

function defineDenyReasons(reasons) {
  return Object.fromEntries(
    reasons.map(([ key, name, description ]) => [ key, { description, name } ])
  );
}

const emojisDenyReasons = defineDenyReasons([
  [ 'background-transparency', 'Background Transparency', 'Emojis should feature a transparent background. Emojis with opaque backgrounds may not blend well with different message backgrounds and could disrupt visual coherence.' ],
  [ 'clear-representation', 'Clear Representation', 'Emojis should clearly represent their intended concept or object. Avoid submitting emojis that are overly abstract or ambiguous, as they may cause confusion or misinterpretation among users.' ],
  [ 'copyright-infringement', 'Copyright Infringement', 'Ensure that your emoji submissions do not violate any copyright or intellectual property rights. Avoid using copyrighted characters, logos, or designs without proper authorization.' ],
  [ 'incoherent-emoji-package-content', 'Incoherent Emoji Package Content', 'Emojis within a package must be compatible with each other to ensure coherence and meaningful usage.' ],
  [ 'offensive-or-inappropriate-content', 'Offensive or Inappropriate Content', 'Emojis depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.' ],
  [ 'reposted-emoji', 'Reposted Emoji', "If the emoji you're submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety." ],
  [ 'whitespace', 'Whitespace', 'Emojis containing excess whitespace around the edges may appear disproportionately small when used in messages. To ensure optimal visibility and legibility, please crop your emojis appropriately before submission.' ]
]);

const botsDenyReasons = defineDenyReasons([
  [ 'against-discord-terms-of-service', 'Against Discord Terms of Service', "Bots that violate Discord's Terms of Service will not be accepted." ],
  [ 'base-functionality-is-broken', 'Base Functionality is Broken', 'Bots must have functional base features to be considered.' ],
  [ 'copied-bot', 'Copied Bot', 'Bots that are direct copies of existing bots will not be accepted.' ],
  [ 'has-vulnerability', 'Has Vulnerability', 'Bots with security vulnerabilities will not be accepted.' ],
  [ 'misleading-or-inaccurate-information', 'Misleading or Inaccurate Information', "Bot with misleading descriptions or information may be removed. Provide clear and accurate details about your bot's purpose and content." ],
  [ 'not-online-or-inviteable', 'Not Online or Inviteable', 'Bots must be online and inviteable for usage.' ],
  [ 'offensive-or-inappropriate-content', 'Offensive or Inappropriate Content', 'Bots depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.' ],
  [ 'reposted-bot', 'Reposted Bot', "If the bot you're submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety." ],
  [ 'support-for-slash-commands', 'Support for Slash Commands', 'Bots must support slash commands for improved user experience and functionality.' ]
]);

const templatesDenyReasons = defineDenyReasons([
  [ 'against-discord-terms-of-service', 'Against Discord Terms of Service', "Templates that violate Discord's Terms of Service will not be accepted." ],
  [ 'duplicate-template', 'Duplicate Template', "If the template you're submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety." ],
  [ 'lacks-clear-focus-or-purpose', 'Advertising and Self-Promotion', 'Templates primarily focused on advertising or self-promotion without providing genuine value to users may not be accepted.' ],
  [ 'misleading-or-inaccurate-information', 'Misleading or Inaccurate Information', "Templates with misleading titles, descriptions, or information may be rejected. Provide clear and accurate details about your template's purpose and features." ],
  [ 'offensive-or-inappropriate-content', 'Offensive or Inappropriate Content', 'Templates featuring offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Ensure your template is suitable for a wide audience and respectful of diverse backgrounds and cultures.' ],
  [ 'poor-quality-or-incomplete-template', 'Poor Quality or Incomplete Template', 'Templates should be well-organized and complete. Submissions with poor structure, missing key elements, or that are not user-friendly may be rejected.' ],
  [ 'proper-categorization', 'Proper Categorization', 'Ensure your template is categorized correctly. Misleading categorization can result in rejection.' ],
  [ 'quality-and-presentation', 'Quality and Presentation', 'Templates should be well-organized and present a professional appearance. Low-quality or poorly managed templates may not be accepted.' ]
]);

const soundsDenyReasons = defineDenyReasons([
  [ 'advertising-and-self-promotion', 'Advertising and Self-Promotion', 'Sounds primarily focused on advertising or self-promotion without providing genuine value to users may not be accepted.' ],
  [ 'lacks-clear-focus-or-purpose', 'Lacks Clear Focus or Purpose', 'Sounds should have a clear focus or purpose. Submissions that are overly broad or lack a specific theme may not be accepted.' ],
  [ 'misleading-or-inaccurate-information', 'Misleading or Inaccurate Information', "Sounds with misleading titles may be rejected. Provide clear and accurate details about your sound's purpose and content." ],
  [ 'offensive-or-inappropriate-content', 'Offensive or Inappropriate Content', 'Sounds featuring offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Ensure your sound is suitable for a wide audience and respectful of diverse backgrounds and cultures.' ],
  [ 'poor-quality-or-incomplete-sound', 'Poor Quality or Incomplete Sound', 'Sounds should be clear, high-quality, and complete. Submissions with poor audio quality, missing key elements, or that are not user-friendly may be rejected.' ],
  [ 'proper-categorization', 'Proper Categorization', 'Ensure your sound is categorized correctly. Misleading categorization can result in rejection.' ],
  [ 'sound-length', 'Sound Length', 'Sounds should be of appropriate length. Extremely short or excessively long sounds may not be accepted.' ],
  [ 'sound-licensing', 'Sound Licensing', 'Ensure your sound does not violate any copyright or intellectual property rights. Avoid using copyrighted audio, music, or sound effects without proper authorization.' ],
  [ 'sound-volume', 'Sound Volume', 'Sounds should be of appropriate volume. Extremely loud or quiet sounds may not be accepted.' ]
]);

const themesDenyReasons = defineDenyReasons([
  [ 'proper-categorization', 'Proper Categorization', 'Ensure your theme is categorized correctly. Misleading categorization can result in rejection.' ]
]);

const quarantineRestrictions = {
  'BOTS_CREATE': { available_to: [ 'USER_ID' ], description: 'Listing bots.' },
  'BOTS_CREATE_API_KEY': { available_to: [ 'USER_ID' ], description: 'Creating bot API keys.' },
  'BOTS_CREATE_REVIEW': { available_to: [ 'USER_ID' ], description: 'Reviewing bots.' },
  'BOTS_VOTE': { available_to: [ 'USER_ID' ], description: 'Voting on bots.' },
  'EMOJIS_CREATE': { available_to: [ 'USER_ID' ], description: 'Publishing emojis.' },
  'EMOJIS_QUICKLY_UPLOAD': { available_to: [ 'USER_ID' ], description: 'Uploading emojis.' },
  'LOGIN': { available_to: [ 'USER_ID' ], description: 'Logging in.' },
  'PROFILES_CREATE': { available_to: [ 'USER_ID' ], description: 'Creating profiles.' },
  'PROFILES_LIKE': { available_to: [ 'USER_ID' ], description: 'Liking profiles.' },
  'REPORTS_CREATE': { available_to: [ 'USER_ID' ], description: 'Creating reports.' },
  'SERVERS_CREATE': { available_to: [ 'USER_ID', 'GUILD_ID' ], description: 'Listing servers.' },
  'SERVERS_CREATE_REVIEW': { available_to: [ 'USER_ID' ], description: 'Reviewing servers.' },
  'SERVERS_VOTE': { available_to: [ 'USER_ID', 'GUILD_ID' ], description: 'Voting on servers.' },
  'SOUNDS_CREATE': { available_to: [ 'USER_ID' ], description: 'Listing sounds.' },
  'SOUNDS_LIKE': { available_to: [ 'USER_ID' ], description: 'Liking sounds.' },
  'TEMPLATES_CREATE': { available_to: [ 'USER_ID' ], description: 'Listing templates.' },
  'TEMPLATES_USE': { available_to: [ 'USER_ID', 'GUILD_ID' ], description: 'Using templates.' },
  'THEMES_CREATE': { available_to: [ 'USER_ID' ], description: 'Listing themes.' }
};

const data = {
  analytics,
  api,
  availableLocales,
  baseUrl,
  botCategories,
  botCategoriesIcons,
  botDescriptionMaxLength,
  botDescriptionMinLength,
  botInviteURL,
  botMaxExtraOwners,
  botsDenyReasons,
  botShortDescriptionMaxLength,
  botShortDescriptionMinLength,
  botTestGuildId,
  customHostnames,
  dashboardRequestDelay,
  discordWebhookRegex,
  docsUrl,
  emojiCategories,
  emojiCategoriesIcons,
  emojiMaxCategoriesLength,
  emojisDenyReasons,
  githubIssuesUrl,
  headerLinks,
  openreplay,
  packagesMaxEmojisLength,
  packagesMinEmojisLength,
  profilesMaxSocialsLength,
  quarantineRestrictions,
  reportReasonMaxCharacters,
  reportReasonMinCharacters,
  reviewsMaxCharacters,
  reviewsMinCharacters,
  serverCategories,
  serverCategoriesIcons,
  serverDescriptionMaxCharacters,
  serverKeywordsMaxCharacters,
  serverKeywordsMaxLength,
  socialNames,
  sortIcons,
  soundCategories,
  soundCategoriesIcons,
  soundsDenyReasons,
  statusBadgeUrl,
  statusUrl,
  supportInviteUrl,
  templateCategories,
  templateCategoriesIcons,
  templateDescriptionMaxLength,
  templateDescriptionMinLength,
  templateMaxCategoriesLength,
  templatesDenyReasons,
  themeCategories,
  themeCategoriesIcons,
  themesDenyReasons,
  themeSensitiveSocialTypes
};

export default data;
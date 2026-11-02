import { az, enUS, tr } from 'date-fns/locale';
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

import shared from './shared.generated.json';

const availableLocales = [
  { code: 'en', countryCode: 'us', dateFnsLocale: enUS, default: true, flag: '🇺🇸', name: 'English' },
  { code: 'tr', countryCode: 'tr', dateFnsLocale: tr, flag: '🇹🇷', name: 'Turkish' },
  { code: 'az', countryCode: 'az', dateFnsLocale: az, flag: '🇦🇿', name: 'Azerbaijani' }
];

const isDev = process.env.NODE_ENV === 'development';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (isDev ? `http://localhost:${process.env.NEXT_PUBLIC_PORT || '5000'}` : 'https://discord.place');
const supportInviteUrl = process.env.NEXT_PUBLIC_SUPPORT_INVITE_URL || 'https://invite.discord.place';
const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.discord.place';
const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL || 'https://status.discord.place';
const botInviteURL = process.env.NEXT_PUBLIC_BOT_INVITE_URL || 'https://bot.discord.place';
const githubIssuesUrl = process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL || 'https://github.com/discordplace/discord.place/issues/new?template=bug-report---feature-request.md';
const linkShortenerHostname = process.env.NEXT_PUBLIC_LINK_SHORTENER_HOSTNAME || 'dsc.im';
const authCookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'token';
const defaultProfileHost = process.env.NEXT_PUBLIC_PROFILE_DEFAULT_HOST || 'discord.place/p';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || (isDev ? 'http://localhost:5001' : 'https://api.discord.place');

const api = {
  internalUrl: process.env.INTERNAL_API_URL || apiUrl,
  url: apiUrl
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

const emojiCategories = [ 'All', ...shared.categories.emoji ];
const serverCategories = [ 'All', ...shared.categories.server ];
const botCategories = [ 'All', ...shared.categories.bot ];
const templateCategories = [ 'All', ...shared.categories.template ];
const soundCategories = shared.categories.sound;
const themeCategories = shared.categories.theme;

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
  'Blue': <span style={{ backgroundColor: '#2B7FFF', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Dark': <span style={{ backgroundColor: 'black', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Gradient': <span style={{ background: 'linear-gradient(to right, #FB64B6, #AD46FF)', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Green': <span style={{ backgroundColor: '#00C950', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Light': <span style={{ backgroundColor: 'white', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Orange': <span style={{ backgroundColor: '#FF6900', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Pink': <span style={{ backgroundColor: '#F6339A', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Purple': <span style={{ backgroundColor: '#AD46FF', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Red': <span style={{ backgroundColor: '#FB2C36', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />,
  'Yellow': <span style={{ backgroundColor: '#F0B100', borderRadius: '50%', display: 'block', height: '14px', width: '14px' }} />
};

const sortIcons = {
  'Boosts': <TiStar />, 'Downloads': <MdDownload />, 'LatestVoted': <MdUpdate />,
  'Likes': <IoHeart />, 'Members': <FaUsers />, 'MostReviewed': <TiStar />,
  'MostViewed': <FaEye />, 'Newest': <HiSortAscending />, 'Oldest': <HiSortDescending />,
  'Popular': <TiStar />, 'Servers': <FaCompass />, 'Votes': <TbSquareRoundedChevronUp />
};

const {
  botDescriptionMaxLength,
  botDescriptionMinLength,
  botMaxExtraOwners,
  botShortDescriptionMaxLength,
  botShortDescriptionMinLength,
  emojiMaxCategoriesLength,
  packagesMaxEmojisLength,
  packagesMinEmojisLength,
  profilesMaxSocialsLength,
  reportReasonMaxCharacters,
  reportReasonMinCharacters,
  reviewReplyMaxCharacters,
  reviewReplyMinCharacters,
  reviewsMaxCharacters,
  reviewsMinCharacters,
  serverDescriptionMaxCharacters,
  serverKeywordsMaxCharacters,
  serverKeywordsMaxLength,
  templateDescriptionMaxLength,
  templateDescriptionMinLength,
  templateMaxCategoriesLength
} = shared.limits;

const botTestGuildId = process.env.NEXT_PUBLIC_BOT_TEST_GUILD_ID || '1239320384441159751';
const dashboardRequestDelay = 1000;

const themeSensitiveSocialTypes = [ 'x', 'custom', 'tiktok', 'github' ];
const discordWebhookRegex = /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;
const customHostnames = process.env.NEXT_PUBLIC_CUSTOM_HOSTNAMES
  ? process.env.NEXT_PUBLIC_CUSTOM_HOSTNAMES.split(',').map(hostname => hostname.trim()).filter(Boolean)
  : [ 'dsc.mom' ];

const socialNames = {
  bluesky: 'Bluesky', facebook: 'Facebook', github: 'GitHub', gitlab: 'GitLab',
  instagram: 'Instagram', linkedin: 'LinkedIn', mastodon: 'Mastodon', reddit: 'Reddit',
  steam: 'Steam', tiktok: 'TikTok', twitch: 'Twitch', twitter: 'Twitter',
  x: 'X', youtube: 'YouTube'
};

const emojisDenyReasons = shared.denyReasons.emojis;
const botsDenyReasons = shared.denyReasons.bots;
const templatesDenyReasons = shared.denyReasons.templates;
const soundsDenyReasons = shared.denyReasons.sounds;
const themesDenyReasons = shared.denyReasons.themes;

const quarantineRestrictions = shared.quarantine.restrictions;

const data = {
  api,
  authCookieName,
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
  defaultProfileHost,
  discordWebhookRegex,
  docsUrl,
  emojiCategories,
  emojiCategoriesIcons,
  emojiMaxCategoriesLength,
  emojisDenyReasons,
  githubIssuesUrl,
  headerLinks,
  linkShortenerHostname,
  packagesMaxEmojisLength,
  packagesMinEmojisLength,
  profilesMaxSocialsLength,
  quarantineRestrictions,
  reportReasonMaxCharacters,
  reportReasonMinCharacters,
  reviewReplyMaxCharacters,
  reviewReplyMinCharacters,
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
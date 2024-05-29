import { CgProfile } from 'react-icons/cg';
import { IoPeople } from 'react-icons/io5';
import { MdEmojiEmotions } from 'react-icons/md';
import { RiRobot2Fill } from 'react-icons/ri';
import { FaShieldAlt } from 'react-icons/fa';
import { AiFillTool } from 'react-icons/ai';
import { BiSolidHappy } from 'react-icons/bi';
import { IoMusicalNotesSharp } from 'react-icons/io5';
import { GiTwoCoins } from 'react-icons/gi';
import { ImUser } from 'react-icons/im';
import { HiDesktopComputer } from 'react-icons/hi';
import { HiMiniPaintBrush } from 'react-icons/hi2';
import { RiInstagramFill } from 'react-icons/ri';
import { MdMenuBook } from 'react-icons/md';
import { TiPlus } from 'react-icons/ti';

const config = {
  supportInviteUrl: 'https://invite.discord.place',
  docsUrl: 'https://docs.discord.place',
  headerBackgroundThresholdY: 50,
  api: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.discord.place'
  },
  getProfileURL: (slug, preferredHost) => {
    const url = `https://${preferredHost}/${slug}`;
    return url;
  },
  headerLinks: [
    {
      title: 'Profiles',
      href: '/profiles',
      icon: CgProfile,
      iconColor: '#3b82f6'
    },
    {
      title: 'Servers',
      href: '/servers',
      icon: IoPeople,
      iconColor: '#7c3aed'
    },
    {
      title: 'Bots',
      href: '/bots',
      icon: RiRobot2Fill,
      iconColor: '#db2777'
    },
    {
      title: 'Emojis',
      href: '/emojis',
      icon: MdEmojiEmotions,
      iconColor: '#14b8a6'
    }
  ],
  errorMessages: {
    '0': 'An unknown error occurred.',
    '401': 'You are not authorized to view this page.',
    '404': 'The page you are looking for does not exist.',
    '50001': 'You are not authorized to edit this profile.',
    '50002': 'The user who created the profile does not currently have a premium.',
    '60001': 'You are not authorized to edit this server.'
  },
  profilesMaxSocialsLength: 8,
  getLoginURL: function (pathname) {
    return this.api.url + `/auth/login?redirect=${encodeURIComponent(
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://discord.place') + pathname
    )}`;
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
  emojiMaxCategoriesLength: 4,
  packagesMinEmojisLength: 4,
  packagesMaxEmojisLength: 9,
  serverKeywordsMaxLength: 5,
  serverKeywordsMaxCharacters: 32,
  serverDescriptionMaxCharacters: 256,
  reviewsMaxCharacters: 256,
  botShortDescriptionMinLength: 16,
  botShortDescriptionMaxLength: 150,
  botDescriptionMinLength: 32,
  botDescriptionMaxLength: 2048,
  themeSensitiveSocialTypes: ['x', 'custom', 'tiktok', 'github'],
  getEmojiURL: (id, animated) => `https://cdn.discord.place/emojis/${id}.${animated ? 'gif' : 'png'}`,
  botInviteURL: 'https://bot.discord.place',
  botCategoriesIcons: {
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
  customHostnames: ['dsc.wtf', 'dsc.dog', 'dsc.mom'],
  emojisDenyReasons: {
    'reposted-emoji': { name: 'Reposted Emoji', description: 'If the emoji you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.' },
    'background-transparency': { name: 'Background Transparency', description: 'Emojis should feature a transparent background. Emojis with opaque backgrounds may not blend well with different message backgrounds and could disrupt visual coherence.' },
    'whitespace': { name: 'Whitespace', description: 'Emojis containing excess whitespace around the edges may appear disproportionately small when used in messages. To ensure optimal visibility and legibility, please crop your emojis appropriately before submission.' },
    'incoherent-emoji-package-content': { name: 'Incoherent Emoji Package Content', description: 'Emojis within a package must be compatible with each other to ensure coherence and meaningful usage.' },
    'offensive-or-inappropriate-content': { name: 'Offensive or Inappropriate Content', description: 'Emojis depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.' },
    'copyright-infringement': { name: 'Copyright Infringement', description: 'Ensure that your emoji submissions do not violate any copyright or intellectual property rights. Avoid using copyrighted characters, logos, or designs without proper authorization.' },
    'clear-representation': { name: 'Clear Representation', description: 'Emojis should clearly represent their intended concept or object. Avoid submitting emojis that are overly abstract or ambiguous, as they may cause confusion or misinterpretation among users.' }
  },
  botsDenyReasons: {
    'reposted-bot': { name: 'Reposted Bot', description: 'If the bot you\'re submitting is already available on the site, your submission may be declined to avoid duplicates and maintain variety.' },
    'offensive-or-inappropriate-content': { name: 'Offensive or Inappropriate Content', description: 'Bots depicting offensive, inappropriate, or sensitive content such as violence, hate speech, nudity, or discrimination will not be accepted. Keep submissions suitable for a wide audience and respectful of diverse backgrounds and cultures.' },
    'against-discord-terms-of-service': { name: 'Against Discord Terms of Service', description: 'Bots that violate Discord\'s Terms of Service will not be accepted.' },
    'not-online-or-inviteable': { name: 'Not Online or Inviteable', description: 'Bots must be online and inviteable for usage.' },
    'base-functionality-is-broken': { name: 'Base Functionality is Broken', description: 'Bots must have functional base features to be considered.' },
    'copied-bot': { name: 'Copied Bot', description: 'Bots that are direct copies of existing bots will not be accepted.' },
    'has-vulnerability': { name: 'Has Vulnerability', description: 'Bots with security vulnerabilities will not be accepted.' },
    'support-for-slash-commands': { name: 'Support for Slash Commands', description: 'Bots must support slash commands for improved user experience and functionality.' }
  }
};

export default config;
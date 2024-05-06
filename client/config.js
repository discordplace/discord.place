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
  headerBackgroundThresholdY: 50,
  api: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.discord.place',
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
      iconColor: '#3b82f6',
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
  }
};

export default config;
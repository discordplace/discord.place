import { SiFacebook, SiGithub, SiInstagram, SiSteam, SiTelegram, SiTiktok, SiTwitch, SiTwitter, SiX, SiYoutube, RiLink, MdQuestionMark } from '@/icons';

export default function getIcon(type) {
  switch (type) {
    case 'instagram':
      return SiInstagram;
    case 'x':
      return SiX;
    case 'twitter':
      return SiTwitter;
    case 'tiktok':
      return SiTiktok;
    case 'facebook':
      return SiFacebook;
    case 'steam':
      return SiSteam;
    case 'github':
      return SiGithub;
    case 'twitch':
      return SiTwitch;
    case 'youtube':
      return SiYoutube;
    case 'telegram':
      return SiTelegram;
    case 'custom':
      return RiLink;
    default:
      return MdQuestionMark;
  }
}
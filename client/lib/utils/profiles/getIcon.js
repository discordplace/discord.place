import { SiFacebook, SiGithub, SiInstagram, SiSteam, SiTelegram, SiTiktok, SiTwitch, FaTwitter, SiX, SiYoutube, SiLinkedin, SiGitlab, SiReddit, SiMastodon, SiBluesky, RiLink } from '@/icons';

export default function getIcon(type) {
  switch (type) {
    case 'instagram':
      return SiInstagram;
    case 'x':
      return SiX;
    case 'twitter':
      return FaTwitter;
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
    case 'linkedin':
      return SiLinkedin;
    case 'gitlab':
      return SiGitlab;
    case 'reddit':
      return SiReddit;
    case 'mastodon':
      return SiMastodon;
    case 'bluesky':
      return SiBluesky;
    case 'custom':
      return RiLink;
    default:
      return null;
  }
}
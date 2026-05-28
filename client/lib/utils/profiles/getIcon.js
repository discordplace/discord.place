import { FaTwitter } from 'react-icons/fa';
import { RiLink } from 'react-icons/ri';
import { SiBluesky, SiFacebook, SiGithub, SiGitlab, SiInstagram, SiLinkedin, SiMastodon, SiReddit, SiSteam, SiTelegram, SiTiktok, SiTwitch, SiX, SiYoutube } from 'react-icons/si';

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
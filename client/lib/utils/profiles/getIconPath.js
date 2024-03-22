
import config from '@/config';

function getIconPath(type, theme) {
  if (config.themeSensitiveSocialTypes.includes(type)) {
    if (theme === 'dark') return `/profile-social-icons/white_${type}.svg`;
    return `/profile-social-icons/black_${type}.svg`;
  }

  return `/profile-social-icons/${type}.svg`;
}

export default getIconPath;
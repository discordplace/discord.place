import config from '@/config';
import incrementDownloads from '@/lib/request/sounds/incrementDownloads';
import revalidateSound from '@/lib/revalidate/sound';

function fileNameSafe(string) {
  return string.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function downloadSound(sound) {
  const filename = `${fileNameSafe(sound.name)}.mp3`;
  const link = document.createElement('a');

  link.href = config.getSoundURL(sound.id);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  incrementDownloads(sound.id);
  revalidateSound(sound.id);
}

export default downloadSound;
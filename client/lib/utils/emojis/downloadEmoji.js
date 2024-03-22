import config from '@/config';
import incrementDownloads from '@/lib/request/emojis/incrementDownloads';
import JSZip from 'jszip';
import { toast } from 'sonner';

function downloadEmoji(emoji) {
  if (emoji.emoji_ids) {
    const zip = new JSZip();
    const fetchPromises = [];

    emoji.emoji_ids.forEach(({ id, animated }) => {
      const extension = animated ? 'gif' : 'png';
      const filename = `${id}.${extension}`;
      const url = config.getEmojiURL(`packages/${emoji.id}/${id}`, animated);
      const fetchPromise = fetch(url)
        .then(response => response.blob())
        .then(blob => zip.file(filename, blob));

      fetchPromises.push(fetchPromise);
    });

    Promise.all(fetchPromises)
      .then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          const filename = `pack-${emoji.id}-${emoji.name}`;
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      })
      .catch(error => toast.error('An unknown error occurred: ' + error.message));

    incrementDownloads(emoji.id, true);
  } else {
    const extension = emoji.animated ? 'gif' : 'png';
    const filename = `${emoji.name}.${extension}`;
    const link = document.createElement('a');
    link.href = emoji.image_url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    incrementDownloads(emoji.id);
  }
}

export default downloadEmoji;

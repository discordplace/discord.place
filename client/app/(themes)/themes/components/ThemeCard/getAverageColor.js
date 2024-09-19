function convertImageToBase64(img) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const blob = xhr.response;
      reader.readAsDataURL(blob);
    };
    
    xhr.onerror = reject;
    xhr.open('GET', img.src);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

function getAverageColorFromBase64(base64Image) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(img, 0, 0, img.width, img.height);

      const imageData = context.getImageData(0, 0, img.width, img.height).data;

      let r = 0, g = 0, b = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }

      const pixelCount = img.width * img.height;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      resolve(hexColor);
    };

    img.onerror = () => reject('Failed to load the base64 image');
  });
}

export default function getAverageColor(image) {
  return convertImageToBase64(image)
    .then(getAverageColorFromBase64)
    .catch(console.error);
}
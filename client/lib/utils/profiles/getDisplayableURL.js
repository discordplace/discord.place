
function getDisplayableURL(url) {
  const { href } = new URL(url);
  const clean = href.replace('https://', '').replace('http://', '');
  if (clean.split('/')[1] === '') return clean.replace('/', '');
  return clean;
}

export default getDisplayableURL;
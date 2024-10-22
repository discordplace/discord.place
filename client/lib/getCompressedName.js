export default function getCompressedName(name, limit) {
  const noVowels = name.replace(/[AEIOUaeiou\s]/g, '');

  let compressedName = '';

  for (let i = 0; i < 3; i++) {
    compressedName += noVowels[i];
    if (compressedName.length === limit) break;
  }

  return compressedName;
}
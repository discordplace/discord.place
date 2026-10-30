import Image from 'next/image';

function shouldUnoptimize(src) {
  if (typeof src !== 'string') return false;

  return /^(https?:|data:|blob:)/i.test(src) || src.split(/[?#]/)[0].toLowerCase().endsWith('.svg');
}

export default function AppImage({ src, unoptimized, ref, ...props }) {
  return (
    <Image
      ref={ref}
      src={src}
      unoptimized={shouldUnoptimize(src) ? true : unoptimized}
      {...props}
    />
  );
}

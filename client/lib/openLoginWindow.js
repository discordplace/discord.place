import config from '@/config';

export default function openLoginWindow(pathname, searchParams) {
  return window.open(config.getLoginURL(pathname, searchParams), '_blank', 'width=600,height=700');
}

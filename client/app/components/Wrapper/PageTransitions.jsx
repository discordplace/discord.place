import { ViewTransitions } from 'next-view-transitions';
import { useMedia } from 'react-use';

export default function PageTransitions({ children }) {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)');

  return (reducedMotion ? (
    children
  ) : (
    <ViewTransitions>
      {children}
    </ViewTransitions>
  ));
}
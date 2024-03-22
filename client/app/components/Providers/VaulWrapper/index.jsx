'use client';

import { useEffect, useRef } from 'react';

export default function VaulWrapper({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.setAttribute('vaul-drawer-wrapper', '');
  }, []);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}
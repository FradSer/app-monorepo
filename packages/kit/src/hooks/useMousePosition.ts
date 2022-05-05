import { useEffect, useState } from 'react';

import { throttle } from 'lodash';

type MousePosition = { x: number; y: number };

// FIXME: this is a temporary solution to get the mouse position and will case
// animation thread blocking.
export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateMousePosition = throttle((event: MouseEvent) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    }, 50);
    document.addEventListener('mousemove', updateMousePosition);
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

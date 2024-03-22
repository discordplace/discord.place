import { motion } from 'framer-motion';
import Image from 'next/image';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
const ForwardedImage = forwardRef((props, ref) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <Image {...props} ref={ref} />
));
const MotionImage = motion(ForwardedImage);

export default MotionImage;
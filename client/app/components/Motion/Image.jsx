import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import Image from '@/app/components/AppImage';

function ForwardedImage(props, ref) {
  return <Image {...props} ref={ref} />;
}

const MotionImage = motion.create(forwardRef(ForwardedImage));

export default MotionImage;
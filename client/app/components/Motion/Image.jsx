import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import Image from '@/app/components/AppImage';

const ForwardedImage = forwardRef((props, ref) => (
  <Image {...props} ref={ref} />
));
const MotionImage = motion.create(ForwardedImage);

export default MotionImage;
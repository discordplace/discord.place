import { motion } from 'framer-motion';
import Image from 'next/image';
import { forwardRef } from 'react';

const ForwardedImage = forwardRef((props, ref) => (
  <Image {...props} ref={ref} />
));
const MotionImage = motion.create(ForwardedImage);

export default MotionImage;
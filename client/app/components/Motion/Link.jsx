import { motion } from 'framer-motion';
import Link from 'next/link';
import { forwardRef } from 'react';

const ForwardedImage = forwardRef((props, ref) => (

  <Link {...props} ref={ref} />
));
const MotionLink = motion(ForwardedImage);

export default MotionLink;
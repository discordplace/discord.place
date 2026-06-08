import { motion } from 'framer-motion';
import Link from 'next/link';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
const ForwardedImage = forwardRef((props, ref) => (

  <Link {...props} ref={ref} />
));
const MotionLink = motion(ForwardedImage);

export default MotionLink;
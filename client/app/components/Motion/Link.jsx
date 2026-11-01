import { motion } from 'framer-motion';
import Link from 'next/link';
import { forwardRef } from 'react';

function ForwardedLink(props, ref) {
  return <Link {...props} ref={ref} />;
}

const MotionLink = motion.create(forwardRef(ForwardedLink));

export default MotionLink;
import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { forwardRef } from 'react';

// eslint-disable-next-line react/display-name
const ForwardedImage = forwardRef((props, ref) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <Link {...props} ref={ref} />
));
const MotionLink = motion(ForwardedImage);

export default MotionLink;
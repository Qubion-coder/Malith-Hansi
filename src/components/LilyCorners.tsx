import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

const LILY_PAIR = '/Gemini_Generated_Image_lutajhlutajhluta-removebg-preview.png';
const LILY_SINGLE = '/Gemini_Generated_Image_ysl6ulysl6ulysl6-removebg-preview.png';

// Calla lilies growing up from the bottom corners of the parent section.
// The parent must be `relative overflow-hidden`; render this before the section content.
export const LilyCorners: React.FC = () => {
  const reducedMotion = useReducedMotion();

  const sway = (angle: number, duration: number) =>
    reducedMotion ? {} : {
      animate: { rotate: [0, angle, 0] },
      transition: { duration, repeat: Infinity, ease: 'easeInOut' as const },
    };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 w-24 sm:w-36 lg:w-48 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.img
          src={LILY_PAIR}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full origin-bottom drop-shadow-[0_8px_16px_rgba(98,114,84,0.2)]"
          style={{ scaleX: -1 }}
          {...sway(-2, 6)}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        className="absolute bottom-0 right-0 w-20 sm:w-32 lg:w-44 pointer-events-none select-none"
        aria-hidden="true"
      >
        <motion.img
          src={LILY_SINGLE}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full origin-bottom drop-shadow-[0_8px_16px_rgba(98,114,84,0.2)]"
          {...sway(2, 7)}
        />
      </motion.div>
    </>
  );
};

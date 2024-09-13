import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

const TextLoop = ({texts, duration = 2000}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      setNextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, duration);

    return () => clearInterval(interval);
  }, [texts.length, duration]);

  const textStyle = {
    lineHeight: "88px",
    fontWeight: 700,
    fontSize: "68px",
    color: "rgba(64, 106, 255, 1)",
    whiteSpace: "nowrap",
  };

  return (
    <span style={{position: "relative", height: "100px"}}>
      <AnimatePresence initial={false}>
        <motion.span
          key={currentIndex}
          initial={{opacity: 1, y: 0}}
          animate={{opacity: 0, y: -88}}
          exit={{opacity: 0, y: -88}}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          style={{...textStyle, position: "absolute", width: "100%", textAlign: "center"}}
        >
          {texts[currentIndex]}
        </motion.span>

        <motion.span
          key={nextIndex}
          initial={{opacity: 0, y: 88}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 1, y: 0}}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          style={{...textStyle, position: "absolute", width: "100%", textAlign: "center"}}
        >
          {texts[nextIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default TextLoop;

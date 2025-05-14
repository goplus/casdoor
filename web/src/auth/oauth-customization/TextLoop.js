import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

const TextLoop = ({prefix, texts, duration = 2000}) => {
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
    color: "rgba(64, 106, 255, 1)",
    whiteSpace: "nowrap",
  };

  return (
    <span style={{position: "relative", height: "100px", width: "100%", overflow: "hidden"}}>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{y: 0}}
          animate={{y: -88}}
          exit={{y: -88}}
          transition={{
            duration: 0.8,
            ease: "linear",
          }}
          style={{position: "absolute", width: "100%", textAlign: "center"}}
        >
          <span>{prefix}</span>
          <span style={textStyle}>{texts[currentIndex]}</span>
        </motion.div>

        <motion.div
          key={nextIndex}
          initial={{y: 88}}
          animate={{y: 0}}
          exit={{y: 0}}
          transition={{
            duration: 0.8,
            ease: "linear",
          }}
          style={{position: "absolute", width: "100%", textAlign: "center"}}
        >
          <span>{prefix}</span>
          <span style={textStyle}>{texts[nextIndex]}</span>
        </motion.div>
      </AnimatePresence>
    </span>
  );
};

export default TextLoop;

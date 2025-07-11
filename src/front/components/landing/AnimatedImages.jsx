import React, { useEffect, useState } from "react";
import { ImageRounded } from "./ImageRounded";
import { motion } from "framer-motion";

export const AnimatedImages = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calcScale = (w, factor) => {
    if (w < 600) return 0.3 * factor;
    if (w < 900) return 0.4 * factor;
    if (w < 1200) return 0.5 * factor;
    return 0.6 * factor;
  };

  const calcX = (w, offset) => {
    if (w < 600) return offset * 0.3;
    if (w < 900) return offset * 0.5;
    if (w < 1200) return offset * 0.75;
    return offset;
  };

  return (
    <>
      <motion.div className="d-flex align-items-center justify-content-center"
        initial={{ opacity: 1, x: calcX(width, 0), scale: calcScale(width, 2) }}
        animate={{ opacity: 1, x: calcX(width, 0), scale: calcScale(width, 2) }}
        transition={{ duration: 1 }}
      >

        <motion.div
          className="position-absolute"
          initial={{ opacity: 0, y: -150, x: calcX(width, 200), scale: calcScale(width, 1) }}
          animate={{ opacity: 1, y: -50, x: calcX(width, 200), scale: calcScale(width, 1) }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ImageRounded src="http://res.cloudinary.com/dftas91qh/image/upload/v1751368182/lerymcc0gn9dozxzobc0.png" />
        </motion.div>

        <motion.div
          className="position-absolute"
          initial={{ opacity: 0, y: -150, x: calcX(width, 0), scale: calcScale(width, 1.2) }}
          animate={{ opacity: 1, y: -50, x: calcX(width, 0), scale: calcScale(width, 1.2) }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ImageRounded src="http://res.cloudinary.com/dftas91qh/image/upload/v1751367803/ymmzj9refqksy8pmybun.png" />

        </motion.div>
        <motion.div
          className="position-absolute"
          initial={{ opacity: 0, y: -10, x: calcX(width, 100), scale: calcScale(width, 1.4) }}
          animate={{ opacity: 1, y: 100, x: calcX(width, 100), scale: calcScale(width, 1.2) }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ImageRounded src="http://res.cloudinary.com/dftas91qh/image/upload/v1751368367/zixxbh2tggeftb6idkdb.png" />
        </motion.div>

        <motion.div
          className="position-absolute"
          initial={{ opacity: 0, y: -10, x: calcX(width, 300), scale: calcScale(width, 1.4) }}
          animate={{ opacity: 1, y: 100, x: calcX(width, 300), scale: calcScale(width, 1.4) }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <ImageRounded src="http://res.cloudinary.com/dftas91qh/image/upload/v1751367602/oj5x5ylrojxd8htkkgdv.png" />
        </motion.div>


        {/* <motion.div
          className="position-absolute text-end text-white" style={{ zIndex: 1, width: "60vw", right: 0 }}
          initial={{ opacity: 0, y: 0, x: calcX(width, 0), scale: calcScale(width, 1.4) }}
          animate={{ opacity: 1, y: 180, x: calcX(width, 250), scale: calcScale(width, 1.6) }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="landing-t4">
            Paddle Surf <br />
            al Amanecer
          </div>
          <div className="landing-t5">Málaga</div>
        </motion.div> */}

      </motion.div>

    </>
  );
};

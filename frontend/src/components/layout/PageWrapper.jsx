import { motion } from "framer-motion";
import { pageTransition } from "../../animation/motionVariants";

const PageWrapper = ({ children }) => {
  return (
    <motion.div {...pageTransition} className="w-full">
      {children}
    </motion.div>
  );
};

export default PageWrapper;

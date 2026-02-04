import { motion } from "framer-motion";
import { Doctor } from "@/types";
import { DoctorCard } from "./DoctorCard";

interface DoctorListProps {
  doctors: Doctor[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export function DoctorList({ doctors }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No specialists found in this area</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {doctors.map((doctor) => (
        <motion.div key={doctor.id} variants={itemVariants}>
          <DoctorCard doctor={doctor} />
        </motion.div>
      ))}
    </motion.div>
  );
}

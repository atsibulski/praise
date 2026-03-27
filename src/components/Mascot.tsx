import { motion } from 'framer-motion';

interface Props {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Mascot({ message, size = 'md', className = '' }: Props) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`relative ${className}`}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-12 right-0 bg-white rounded-2xl rounded-br-sm px-3 py-1.5 shadow-md max-w-[180px]"
        >
          <p className="text-xs font-semibold text-ink whitespace-nowrap">{message}</p>
        </motion.div>
      )}
      <motion.div
        className={`${sizes[size]} animate-float`}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Body - gradient purple blob */}
          <defs>
            <radialGradient id="mascotGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#DDD6FE" />
              <stop offset="50%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#A78BFA" />
            </radialGradient>
            <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FECDD3" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FECDD3" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Main body blob */}
          <ellipse cx="50" cy="55" rx="38" ry="35" fill="url(#mascotGrad)" />

          {/* Highlight shine */}
          <ellipse cx="38" cy="42" rx="12" ry="8" fill="white" opacity="0.2" />

          {/* Eyes */}
          <ellipse cx="38" cy="50" rx="4.5" ry="5.5" fill="#1A1A1A" />
          <ellipse cx="62" cy="50" rx="4.5" ry="5.5" fill="#1A1A1A" />

          {/* Eye highlights */}
          <circle cx="36" cy="47" r="2" fill="white" />
          <circle cx="60" cy="47" r="2" fill="white" />

          {/* Rosy cheeks */}
          <circle cx="28" cy="58" r="6" fill="url(#cheekGrad)" />
          <circle cx="72" cy="58" r="6" fill="url(#cheekGrad)" />

          {/* Cute smile */}
          <path d="M42 62 Q50 70 58 62" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Little hand/wave */}
          <ellipse cx="78" cy="72" rx="8" ry="6" fill="url(#mascotGrad)" />
        </svg>
      </motion.div>
    </div>
  );
}

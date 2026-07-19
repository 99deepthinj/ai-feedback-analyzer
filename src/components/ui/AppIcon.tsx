import { motion } from 'framer-motion'

interface AppIconProps {
  size?: number
  animate?: boolean
  className?: string
}

export default function AppIcon({ size = 32, animate = true, className }: AppIconProps) {
  const r = size * 0.219

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="AI Feedback Analyzer"
      whileHover={animate ? { scale: 1.08, rotate: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <defs>
        <linearGradient id={`ai-bg-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6D28D9"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
        <linearGradient id={`ai-line-${size}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#A78BFA"/>
          <stop offset="100%" stopColor="#E9D5FF"/>
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="32" height="32" rx={r} fill={`url(#ai-bg-${size})`}/>
      {/* Shine */}
      <rect width="32" height="14" rx={r} fill="#ffffff" fillOpacity="0.08"/>

      {/* Trend line */}
      <polyline
        points="5,24 11,19 19,13 27,7"
        fill="none"
        stroke={`url(#ai-line-${size})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Baseline */}
      <line x1="4" y1="26.5" x2="28" y2="26.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.2"/>

      {/* Data nodes */}
      <circle cx="5"  cy="24" r="2.2" fill="#C4B5FD"/>
      <circle cx="11" cy="19" r="2.4" fill="#C4B5FD"/>
      <circle cx="19" cy="13" r="2.6" fill="#DDD6FE"/>
      <circle cx="27" cy="7"  r="3"   fill="#EDE9FE"/>

      {/* Sparkle */}
      <path
        d="M27 4 L27.8 6.2 L30 7 L27.8 7.8 L27 10 L26.2 7.8 L24 7 L26.2 6.2 Z"
        fill="#7C3AED"
        fillOpacity="0.9"
      />
    </motion.svg>
  )
}

export function AppIconHero({ size = 48 }: { size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        role="img"
        aria-label="AI Feedback Analyzer"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        whileHover={{ scale: 1.1 }}
      >
        <defs>
          <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6D28D9"/>
            <stop offset="100%" stopColor="#7C3AED"/>
          </linearGradient>
          <linearGradient id="hero-line" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#A78BFA"/>
            <stop offset="100%" stopColor="#E9D5FF"/>
          </linearGradient>
          <filter id="hero-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect width="32" height="32" rx="7" fill="url(#hero-bg)"/>
        <rect width="32" height="14" rx="7" fill="#ffffff" fillOpacity="0.1"/>

        <g filter="url(#hero-glow)">
          <polyline
            points="5,24 11,19 19,13 27,7"
            fill="none"
            stroke="url(#hero-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <line x1="4" y1="26.5" x2="28" y2="26.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.2"/>

        <g filter="url(#hero-glow)">
          <circle cx="5"  cy="24" r="2.2" fill="#C4B5FD"/>
          <circle cx="11" cy="19" r="2.4" fill="#C4B5FD"/>
          <circle cx="19" cy="13" r="2.6" fill="#DDD6FE"/>
          <circle cx="27" cy="7"  r="3"   fill="#EDE9FE"/>
        </g>

        <motion.path
          d="M27 4 L27.8 6.2 L30 7 L27.8 7.8 L27 10 L26.2 7.8 L24 7 L26.2 6.2 Z"
          fill="#7C3AED"
          fillOpacity="0.9"
          animate={{ rotate: [0, 15, 0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '27px', originY: '7px' }}
        />
      </motion.svg>
    </motion.div>
  )
}

export function AppIconPulse({ size = 64 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-[22%]"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <AppIcon size={size} animate={false} />
    </div>
  )
}

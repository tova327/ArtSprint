"use client"

import styled, { keyframes } from "styled-components"
import { motion } from "framer-motion"

const gradientAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const Gradient = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: linear-gradient(
    120deg,
    #ff6b6b 0%,
    #4ecdc4 25%,
    #45b7d1 50%,
    #96ceb4 75%,
    #ffeaa7 100%
  );
  background-size: 400% 400%;
  animation: ${gradientAnim} 15s ease-in-out infinite;
  overflow: hidden;
`

const Particle = styled(motion.div)<{
  size: number
  blur: number
  left: number
  top: number
  color: string
}>`
  position: absolute;
  left: ${(props) => props.left}vw;
  top: ${(props) => props.top}vh;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: ${(props) => props.color};
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(${(props) => props.blur}px);
  pointer-events: none;
`

const PARTICLE_COLORS = ["#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#10ac84", "#ee5a24", "#0abde3"]

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const PARTICLES = Array.from({ length: 15 }).map(() => ({
  size: getRandom(40, 100),
  blur: getRandom(10, 25),
  left: getRandom(0, 100),
  top: getRandom(0, 100),
  color: PARTICLE_COLORS[Math.floor(getRandom(0, PARTICLE_COLORS.length))],
}))

export default function BreathtakingBackground() {
  return (
    <Gradient>
      {PARTICLES.map((p, i) => (
        <Particle
          key={i}
          {...p}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: getRandom(6, 12),
            delay: getRandom(0, 5),
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </Gradient>
  )
}

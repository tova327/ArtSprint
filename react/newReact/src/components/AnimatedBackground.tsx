
import styled, { keyframes } from "styled-components";

const gradientAnim = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Gradient = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: linear-gradient(
    120deg,
rgb(249, 53, 35) 0%,
rgb(243, 255, 78) 30%,
rgb(25, 247, 195) 70%,
rgb(212, 81, 203) 100%
  );
  background-size: 200% 200%;
  animation: ${gradientAnim} 14s ease-in-out infinite;
  transition: background 0.5s;
  overflow: hidden;
`;

const Particle = styled.div<{ size: number; blur: number; left: number; top: number; duration: number; delay: number; color: string }>`
  position: absolute;
  left: ${props => props.left}vw;
  top: ${props => props.top}vh;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  opacity: 0.18;
  filter: blur(${props => props.blur}px);
  pointer-events: none;
  animation: floatParticle ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;

  @keyframes floatParticle {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.17;
    }
    30% {
      opacity: 0.25;
      filter: blur(${props => props.blur * 0.7}px);
    }
    50% {
      transform: translateY(-40px) scale(1.04);
      opacity: 0.35;
      filter: blur(${props => props.blur * 1.3}px);
    }
    70% {
      opacity: 0.22;
      filter: blur(${props => props.blur * 0.8}px);
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 0.17;
    }
  }
`;

const PARTICLE_COLORS = [
  "#ffffff",
  "#ffecd2",
  "#a7bfe8",
  "#f7797d",
  "#fad0c4",
  "#b2fefa",
  "#e0c3fc"
];

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// 10-14 particles, different on every load for a natural look!
const PARTICLES = Array.from({ length: 12 }).map(() => ({
  size: getRandom(60, 120),
  blur: getRandom(16, 36),
  left: getRandom(2, 92),
  top: getRandom(4, 85),
  duration: getRandom(8, 16),
  delay: getRandom(0, 10),
  color: PARTICLE_COLORS[Math.floor(getRandom(0, PARTICLE_COLORS.length))]
}));

export default function BreathtakingBackground() {
  return (
    <Gradient>
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </Gradient>
  );
}
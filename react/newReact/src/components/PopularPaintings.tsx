"use client"

import type React from "react"
import styled, { keyframes } from "styled-components"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { ESubject } from "../store/paintingSlice"
import { motion } from "framer-motion"

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`

const TickerContainer = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #fad0c4 100%);
  border-radius: 30px;
  box-shadow: 0 15px 50px rgba(255, 154, 158, 0.4);
  margin-bottom: 40px;
  padding: 30px 0;
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${shimmer} 3s infinite;
  }
`

const PaintingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  min-width: 100vw;
  animation: ${shimmer} 35s linear infinite;
`

const PopularCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  box-shadow: 0 8px 35px rgba(255, 107, 107, 0.2);
  border: 4px solid #ff6b6b;
  min-width: 320px;
  max-width: 360px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
    transition: left 0.8s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: scale(1.12) rotate(2deg);
    box-shadow: 0 20px 60px rgba(255, 107, 107, 0.4);
    border-color: #4ecdc4;
  }
`

const Medal = styled(motion.div)`
  font-size: 2.5rem;
  margin-bottom: 12px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
`

const CardTitle = styled(motion.div)`
  font-weight: 900;
  font-size: 1.4rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  text-align: center;
  line-height: 1.3;
`

const CardSubtitle = styled(motion.div)`
  color: #666;
  font-size: 15px;
  margin-bottom: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`

const PopularPaintings: React.FC = () => {
  const paintings = useSelector((store: StoreType) => store.painting.paintings)

  const topPaintings = [...paintings]
    .filter((p) => p.isMedal || p.likes >= 2)
    .sort((a, b) => b.likes - a.likes || (b.isMedal ? 1 : -1))
    .slice(0, 10)

  if (!topPaintings.length) return null

  return (
    <TickerContainer initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <motion.h3
        style={{
          textAlign: "center",
          marginBottom: 25,
          fontSize: "2.2rem",
          fontWeight: 900,
          background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        🌟 Trending Masterpieces 🌟
      </motion.h3>

      <PaintingsRow>
        {topPaintings.map((painting, i) => (
          <PopularCard
            key={painting.id}
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: i * 0.15,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            onClick={() => (window.location.href = `/painting/${painting.id}`)}
            whileHover={{
              scale: 1.15,
              rotate: 3,
              transition: { duration: 0.3 },
            }}
          >
            {painting.isMedal && (
              <Medal
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  delay: 0.5,
                  duration: 1,
                  rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                }}
              >
                🏅
              </Medal>
            )}

            <CardTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {painting.name}
            </CardTitle>

            <CardSubtitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
              <span>{ESubject[painting.subject]}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                ❤️
              </motion.span>
              <span>{painting.likes}</span>
            </CardSubtitle>

            {["Drawing", "Photography", "Graphic"].includes(ESubject[painting.subject]) && (
              <motion.img
                src={painting.url}
                alt={painting.name}
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 15,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  border: "3px solid rgba(255, 107, 107, 0.3)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              />
            )}

            {ESubject[painting.subject] === "Music" && (
              <motion.div
                style={{ fontSize: "3rem" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 },
                }}
              >
                🎵
              </motion.div>
            )}

            {ESubject[painting.subject] === "Writing" && (
              <motion.div
                style={{ fontSize: "3rem" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 },
                }}
              >
                📝
              </motion.div>
            )}
          </PopularCard>
        ))}
      </PaintingsRow>
    </TickerContainer>
  )
}

export default PopularPaintings

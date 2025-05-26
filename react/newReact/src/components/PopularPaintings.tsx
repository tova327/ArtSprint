"use client"

import type React from "react"
import styled, { keyframes } from "styled-components"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { ESubject } from "../store/paintingSlice"
import { motion } from "framer-motion"

const ticker = keyframes`
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100vw); }
`

const TickerContainer = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(255, 175, 189, 0.3);
  margin-bottom: 32px;
  padding: 24px 0;
  position: relative;
`

const PaintingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  min-width: 100vw;
  animation: ${ticker} 30s linear infinite;
`

const PopularCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(255, 64, 129, 0.15);
  border: 3px solid #ff9800;
  min-width: 280px;
  max-width: 320px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: scale(1.08) rotate(1deg);
    box-shadow: 0 12px 40px rgba(255, 64, 129, 0.3);
    border-color: #ff4081;
  }
`

const Medal = styled(motion.div)`
  font-size: 2rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
`

const CardTitle = styled(motion.div)`
  font-weight: 800;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #ff4081, #ff9800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  text-align: center;
  line-height: 1.3;
`

const CardSubtitle = styled(motion.div)`
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 600;
`

const PopularPaintings: React.FC = () => {
  const paintings = useSelector((store: StoreType) => store.painting.paintings)

  const topPaintings = [...paintings]
    .filter((p) => p.isMedal || p.likes >= 2)
    .sort((a, b) => b.likes - a.likes || (b.isMedal ? 1 : -1))
    .slice(0, 8)

  if (!topPaintings.length) return null

  return (
    <TickerContainer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <motion.h3
        style={{
          textAlign: "center",
          marginBottom: 20,
          fontSize: "1.8rem",
          fontWeight: 800,
          background: "linear-gradient(45deg, #ff4081, #ff9800)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        🌟 Popular Masterpieces 🌟
      </motion.h3>

      <PaintingsRow>
        {topPaintings.map((painting, i) => (
          <PopularCard
            key={painting.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            onClick={() => (window.location.href = `/painting/${painting.id}`)}
          >
            {painting.isMedal && (
              <Medal
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                🏅
              </Medal>
            )}

            <CardTitle
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {painting.name}
            </CardTitle>

            <CardSubtitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
              {ESubject[painting.subject]} • ❤️ {painting.likes}
            </CardSubtitle>

            {["Drawing", "Photography", "Graphic"].includes(ESubject[painting.subject]) && (
              <motion.img
                src={painting.url}
                alt={painting.name}
                style={{
                  width: "100%",
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
            )}

            {ESubject[painting.subject] === "Music" && (
              <motion.span
                style={{ fontSize: "2rem" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                🎵
              </motion.span>
            )}

            {ESubject[painting.subject] === "Writing" && (
              <motion.span
                style={{ fontSize: "2rem" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                📝
              </motion.span>
            )}
          </PopularCard>
        ))}
      </PaintingsRow>
    </TickerContainer>
  )
}

export default PopularPaintings

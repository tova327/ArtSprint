"use client"

import type React from "react"
import styled, { keyframes } from "styled-components"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { ESubject } from "../store/paintingSlice"
import { motion } from "framer-motion"

const walkingAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-5px) rotate(1deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(-5px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`

const PathwayContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: 40px 0;
  padding: 20px 0;
`

const PathwayTrack = styled(motion.div)`
  position: relative;
  height: 8px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  border-radius: 4px;
  margin: 0 auto;
  width: 90%;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    height: 30px;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(8px);
  }
`

const PathwayTitle = styled(motion.h3)`
  text-align: center;
  margin-bottom: 30px;
  font-weight: 900;
  font-size: 2rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
    border-radius: 2px;
  }
`

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const PaintingsRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 30px;
  position: relative;
  padding: 20px 0;
  width: max-content;
`

const PaintingCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.2);
  border: 3px solid #ff6b6b;
  width: 200px;
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: -120px;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 30px;
    background: #ff6b6b;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
  }
  
  &:hover {
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 15px 35px rgba(255, 107, 107, 0.4);
    animation: ${walkingAnimation} 1s ease-in-out infinite;
  }
`

const Medal = styled(motion.div)`
  font-size: 2rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
`

const CardTitle = styled(motion.div)`
  font-weight: 800;
  font-size: 1.1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
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
  margin-bottom: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
`

const ScrollContainer = styled(motion.div)`
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
  margin-top: 100px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
    border-radius: 4px;
  }
`

const FootprintLeft = styled(motion.div)`
  position: absolute;
  font-size: 1.2rem;
  bottom: 15px;
  transform: rotate(-15deg);
`

const FootprintRight = styled(motion.div)`
  position: absolute;
  font-size: 1.2rem;
  bottom: 15px;
  transform: rotate(15deg);
`

const PopularPaintings: React.FC = () => {
  const paintings = useSelector((store: StoreType) => store.painting.paintings)

  const topPaintings = [...paintings]
    .filter((p) => p.isMedal || p.likes >= 2)
    .sort((a, b) => b.likes - a.likes || (b.isMedal ? 1 : -1))
    .slice(0, 10)

  if (!topPaintings.length) return null

  return (
    <PathwayContainer initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <TitleContainer>
        <PathwayTitle
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          🌟 Trending Masterpieces 🌟
        </PathwayTitle>
      </TitleContainer>

      <PathwayTrack
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      />

      <ScrollContainer>
        <PaintingsRow>
          {topPaintings.map((painting, i) => (
            <PaintingCard
              key={painting.id}
              initial={{ opacity: 0, y: 50, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.15,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              onClick={() => (window.location.href = `/painting/${painting.id}`)}
              whileHover={{
                y: -15,
                scale: 1.05,
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

              <CardSubtitle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
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
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 10,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    border: "2px solid rgba(255, 107, 107, 0.3)",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                />
              )}

              {ESubject[painting.subject] === "Music" && (
                <motion.div
                  style={{ fontSize: "2.5rem" }}
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
                  style={{ fontSize: "2.5rem" }}
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

              <FootprintLeft
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  delay: i * 0.3,
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              >
                👣
              </FootprintLeft>

              <FootprintRight
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  delay: i * 0.3 + 1,
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              >
                👣
              </FootprintRight>
            </PaintingCard>
          ))}
        </PaintingsRow>
      </ScrollContainer>
    </PathwayContainer>
  )
}

export default PopularPaintings

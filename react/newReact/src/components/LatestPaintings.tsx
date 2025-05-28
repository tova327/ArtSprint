"use client"

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
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 30px 30px 0 0;
  border-top: 4px solid #4ecdc4;
`

const PathwayTrack = styled(motion.div)`
  position: relative;
  height: 8px;
  background: linear-gradient(90deg, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
  border-radius: 4px;
  margin: 0 auto;
  width: 90%;
  box-shadow: 0 4px 20px rgba(76, 201, 196, 0.3);
  
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
  background: linear-gradient(45deg, #4ecdc4, #ffeaa7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 15px rgba(76, 201, 196, 0.3);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #4ecdc4, #ffeaa7);
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
  box-shadow: 0 8px 25px rgba(76, 201, 196, 0.2);
  border: 3px solid #4ecdc4;
  width: 180px;
  height: 200px;
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
    background: #4ecdc4;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 4px 10px rgba(76, 201, 196, 0.3);
  }
  
  &:hover {
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 15px 35px rgba(76, 201, 196, 0.4);
    animation: ${walkingAnimation} 1s ease-in-out infinite;
  }
`

const CardTitle = styled(motion.span)`
  font-weight: 800;
  font-size: 1rem;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
  background: linear-gradient(45deg, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const CardSubject = styled(motion.span)`
  font-size: 13px;
  color: #666;
  font-weight: 700;
  margin-bottom: 10px;
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
    background: linear-gradient(90deg, #4ecdc4, #ffeaa7);
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

const NewBadge = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #4ecdc4, #45b7d1);
  color: white;
  font-weight: 800;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(76, 201, 196, 0.3);
`

const LatestPaintings = () => {
  const paintings = useSelector((store: StoreType) => store.painting.paintings)

  const latest = [...paintings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  if (!latest.length) return null

  return (
    <PathwayContainer initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <TitleContainer>
        <PathwayTitle
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          ✨ Fresh Creations ✨
        </PathwayTitle>
      </TitleContainer>

      <PathwayTrack
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      />

      <ScrollContainer>
        <PaintingsRow>
          {latest.map((painting, i) => (
            <PaintingCard
              key={painting.id}
              initial={{ opacity: 0, y: 50, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.12 + 0.6,
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
              <NewBadge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.12 + 0.8, type: "spring" }}
              >
                NEW
              </NewBadge>

              <CardTitle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.8, duration: 0.6 }}
              >
                {painting.name}
              </CardTitle>

              <CardSubject
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.9, duration: 0.6 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  🎨
                </motion.span>
                <span>{ESubject[painting.subject]}</span>
              </CardSubject>

              {["Drawing", "Photography", "Graphic"].includes(ESubject[painting.subject]) && (
                <motion.img
                  src={painting.url}
                  alt={painting.name}
                  style={{
                    width: "100%",
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 10,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    border: "2px solid rgba(76, 201, 196, 0.3)",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.12 + 1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                />
              )}

              {ESubject[painting.subject] === "Music" && (
                <motion.div
                  style={{ fontSize: "2.2rem" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.12 + 1, duration: 0.6 }}
                  whileHover={{
                    rotate: [0, -15, 15, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  🎵
                </motion.div>
              )}

              {ESubject[painting.subject] === "Writing" && (
                <motion.div
                  style={{ fontSize: "2.2rem" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.12 + 1, duration: 0.6 }}
                  whileHover={{
                    rotate: [0, -15, 15, 0],
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

export default LatestPaintings

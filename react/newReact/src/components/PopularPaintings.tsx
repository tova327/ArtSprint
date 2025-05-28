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

const Container = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #fad0c4 100%);
  border-radius: 30px;
  box-shadow: 0 15px 50px rgba(255, 154, 158, 0.26);
  margin-bottom: 40px;
  padding: 30px 0 30px 0;
  border: 3px solid rgba(255, 255, 255, 0.25);
`

const Title = styled(motion.h3)`
  text-align: center;
  font-weight: 900;
  font-size: 2.2rem;
  margin-bottom: 35px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
`

const PaintingsRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 32px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: #ff6b6b #fafafa;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ff6b6b;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #fff;
  }
`

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.97);
  border-radius: 25px;
  border: 4px solid #ff6b6b;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.18);
  min-width: 320px;
  max-width: 350px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 18px 18px 18px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow .18s, border-color .18s, transform .18s;

  &:hover {
    transform: scale(1.09) rotate(2deg);
    box-shadow: 0 20px 60px rgba(255, 107, 107, 0.37);
    border-color: #4ecdc4;
    animation: ${shimmer} 1s ease-in-out infinite;
  }
`

const Badge = styled(motion.div)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  background: linear-gradient(135deg, #ffe54c, #ffb347);
  color: #4e381a;
  font-weight: 900;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(255, 229, 76, 0.19);
  display: flex;
  align-items: center;
  gap: 6px;
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
    <Container initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <Title
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        🌟 Trending Masterpieces 🌟
      </Title>
      <PaintingsRow>
        {topPaintings.map((painting, i) => (
          <Card
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
              scale: 1.12,
              rotate: 2,
              transition: { duration: 0.3 },
            }}
          >
            {painting.isMedal && (
              <Badge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.7, type: "spring" }}
              >
                🏅 MEDAL
              </Badge>
            )}
            <CardTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.8, duration: 0.6 }}
            >
              {painting.name}
            </CardTitle>
            <CardSubtitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.9, duration: 0.6 }}>
              <span>{ESubject[painting.subject]}</span>
              <motion.span
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                style={{ marginLeft: 4 }}
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
                  boxShadow: "0 6px 20px rgba(0,0,0,0.09)",
                  border: "3px solid rgba(255, 107, 107, 0.21)",
                  marginBottom: "10px"
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.11 + 1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              />
            )}
            {ESubject[painting.subject] === "Music" && (
              <motion.div
                style={{ fontSize: "2.3rem" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 1, duration: 0.6 }}
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
                style={{ fontSize: "2.3rem" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 1, duration: 0.6 }}
                whileHover={{
                  rotate: [0, -15, 15, 0],
                  transition: { duration: 0.5 },
                }}
              >
                📝
              </motion.div>
            )}
          </Card>
        ))}
      </PaintingsRow>
    </Container>
  )
}

export default PopularPaintings
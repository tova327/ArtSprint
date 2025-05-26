"use client"

import styled from "styled-components"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { ESubject } from "../store/paintingSlice"
import { motion } from "framer-motion"

const GlassLatest = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px 30px 0 0;
  box-shadow: 0 -8px 40px rgba(76, 201, 196, 0.2);
  padding: 40px 4vw;
  margin-top: 60px;
  border-top: 4px solid #4ecdc4;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(76, 201, 196, 0.05), rgba(255, 234, 167, 0.05));
    pointer-events: none;
  }
`

const SectionTitle = styled(motion.h3)`
  background: linear-gradient(45deg, #4ecdc4, #ffeaa7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: 2.2rem;
  margin-bottom: 30px;
  letter-spacing: 3px;
  text-align: center;
  text-shadow: 0 4px 15px rgba(76, 201, 196, 0.3);
`

const LatestRow = styled(motion.div)`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
`

const LatestCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(76, 201, 196, 0.2);
  border: 3px solid #4ecdc4;
  min-width: 240px;
  max-width: 260px;
  min-height: 140px;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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
    background: linear-gradient(90deg, transparent, rgba(76,201,196,0.3), transparent);
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-8px) scale(1.05) rotate(1deg);
    box-shadow: 0 15px 45px rgba(76, 201, 196, 0.35);
    border-color: #ffeaa7;
  }
`

const CardTitle = styled(motion.span)`
  font-weight: 800;
  font-size: 1.2rem;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
  background: linear-gradient(45deg, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const CardSubject = styled(motion.span)`
  font-size: 14px;
  color: #666;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`

const LatestPaintings = () => {
  const paintings = useSelector((store: StoreType) => store.painting.paintings)

  const latest = [...paintings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  if (!latest.length) return null

  return (
    <GlassLatest
      style={{ width: "100vw" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <SectionTitle
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        ✨ Fresh Creations ✨
      </SectionTitle>

      <LatestRow initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
        {latest.map((painting, i) => (
          <LatestCard
            key={painting.id}
            initial={{ opacity: 0, y: 30, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{
              delay: i * 0.12 + 0.6,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            onClick={() => (window.location.href = `/painting/${painting.id}`)}
            whileHover={{
              scale: 1.08,
              rotate: 2,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
          >
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
                  borderRadius: 12,
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
                style={{ fontSize: "2rem" }}
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
                style={{ fontSize: "2rem" }}
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
          </LatestCard>
        ))}
      </LatestRow>
    </GlassLatest>
  )
}

export default LatestPaintings

"use client"

import styled from "styled-components"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { ESubject } from "../store/paintingSlice"
import { motion } from "framer-motion"

const GlassLatest = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 30px rgba(60, 60, 130, 0.15);
  padding: 32px 4vw;
  margin-top: 48px;
  border-top: 3px solid #56c6ff;
`

const SectionTitle = styled(motion.h3)`
  background: linear-gradient(45deg, #56c6ff, #7a42f4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  font-size: 1.8rem;
  margin-bottom: 24px;
  letter-spacing: 2px;
  text-align: center;
`

const LatestRow = styled(motion.div)`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`

const LatestCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(86, 198, 255, 0.15);
  border: 2px solid #56c6ff;
  min-width: 200px;
  max-width: 220px;
  min-height: 120px;
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
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
    background: linear-gradient(90deg, transparent, rgba(86,198,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 8px 30px rgba(86, 198, 255, 0.25);
    border-color: #7a42f4;
  }
`

const CardTitle = styled(motion.span)`
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
  text-align: center;
  margin-bottom: 6px;
`

const CardSubject = styled(motion.span)`
  font-size: 13px;
  color: #666;
  font-weight: 600;
  margin-bottom: 8px;
`

const LatestPaintings = () => {
  const paintings = useSelector((store: StoreType) => store.painting.paintings)

  const latest = [...paintings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  if (!latest.length) return null

  return (
    <GlassLatest
      style={{ width: "100vw" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <SectionTitle
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        ✨ Latest Creations ✨
      </SectionTitle>

      <LatestRow initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
        {latest.map((painting, i) => (
          <LatestCard
            key={painting.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.5, duration: 0.6 }}
            onClick={() => (window.location.href = `/painting/${painting.id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CardTitle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.7, duration: 0.6 }}
            >
              {painting.name}
            </CardTitle>

            <CardSubject
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.8, duration: 0.6 }}
            >
              {ESubject[painting.subject]}
            </CardSubject>

            {["Drawing", "Photography", "Graphic"].includes(ESubject[painting.subject]) && (
              <motion.img
                src={painting.url}
                alt={painting.name}
                style={{
                  width: "100%",
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.9, duration: 0.6 }}
              />
            )}
          </LatestCard>
        ))}
      </LatestRow>
    </GlassLatest>
  )
}

export default LatestPaintings

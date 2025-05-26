"use client"

import type React from "react"
import { Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

const GlassBar = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(25px);
  border-radius: 0 0 30px 30px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 3px solid rgba(255, 107, 107, 0.3);
`

const subjects = [
  { name: "Music", color: "#ff6b6b", emoji: "🎵", gradient: "linear-gradient(135deg, #ff6b6b, #ee5a52)" },
  { name: "Drawing", color: "#4ecdc4", emoji: "🎨", gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)" },
  { name: "Photography", color: "#45b7d1", emoji: "📸", gradient: "linear-gradient(135deg, #45b7d1, #3498db)" },
  { name: "Graphic", color: "#96ceb4", emoji: "🎭", gradient: "linear-gradient(135deg, #96ceb4, #85c1a3)" },
  { name: "Writing", color: "#ffeaa7", emoji: "✍️", gradient: "linear-gradient(135deg, #ffeaa7, #fdcb6e)" },
]

const StyledMenuItem = styled(motion.div)<{ color: string; gradient: string }>`
  color: white;
  background: ${(props) => props.gradient};
  border-radius: 25px;
  margin: 0 10px;
  border: 3px solid ${(props) => props.color};
  font-weight: 800;
  font-size: 17px;
  padding: 12px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px ${(props) => props.color}33;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 30px ${(props) => props.color}55;
  }
`

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = (subject: string) => {
    const params = new URLSearchParams(location.search)
    params.set("subject", subject)
    navigate({ search: params.toString() })
  }

  return (
    <GlassBar initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, type: "spring" }}>
      <Menu
        mode="horizontal"
        style={{
          background: "transparent",
          borderBottom: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80px",
        }}
        selectable={false}
        overflowedIndicator={<></>}
      >
        {subjects.map((subject, index) => (
          <Menu.Item key={subject.name} style={{ border: "none", background: "transparent" }}>
            <StyledMenuItem
              color={subject.color}
              gradient={subject.gradient}
              onClick={() => handleMenuClick(subject.name)}
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.1,
                y: -5,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {subject.emoji}
              </motion.span>
              <span>{subject.name}</span>
            </StyledMenuItem>
          </Menu.Item>
        ))}
      </Menu>
    </GlassBar>
  )
}

export default Navbar

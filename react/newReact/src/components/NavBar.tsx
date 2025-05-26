"use client"

import type React from "react"
import { Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

const GlassBar = styled(motion.div)`
  background: ${({ theme }: { theme: any }) => theme.navGlass};
  border-bottom: ${({ theme }: { theme: any }) => theme.navBorder};
  backdrop-filter: blur(20px);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 30px rgba(60, 60, 170, 0.15);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
`

const subjects = [
  { name: "Music", color: "#ff4081", emoji: "🎵" },
  { name: "Drawing", color: "#ff9800", emoji: "🎨" },
  { name: "Photography", color: "#56c6ff", emoji: "📸" },
  { name: "Graphic", color: "#7a42f4", emoji: "🎭" },
  { name: "Writing", color: "#29d98c", emoji: "✍️" },
]

const StyledMenuItem = styled(motion.div)<{ color: string }>`
  color: ${(props) => props.color};
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin: 0 8px;
  border: 2px solid ${(props) => props.color};
  font-weight: 700;
  font-size: 16px;
  padding: 8px 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${(props) => props.color}22;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${(props) => props.color}33;
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
    <GlassBar initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, type: "spring" }}>
      <Menu
        mode="horizontal"
        style={{
          background: "transparent",
          borderBottom: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70px",
        }}
        selectable={false}
        overflowedIndicator={<></>}
      >
        {subjects.map((subject, index) => (
          <Menu.Item key={subject.name} style={{ border: "none", background: "transparent" }}>
            <StyledMenuItem
              color={subject.color}
              onClick={() => handleMenuClick(subject.name)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{subject.emoji}</span>
              <span>{subject.name}</span>
            </StyledMenuItem>
          </Menu.Item>
        ))}
      </Menu>
    </GlassBar>
  )
}

export default Navbar

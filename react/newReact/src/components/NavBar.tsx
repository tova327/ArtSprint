"use client"

import type React from "react"
import { Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

const SidebarContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 80px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 0 25px 25px 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-right: 2px solid rgba(255, 107, 107, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  transition: width 0.3s ease;

  &:hover {
    width: 120px;
  }

  @media (max-width: 768px) {
    width: 60px;
    &:hover {
      width: 80px;
    }
  }
`

const subjects = [
  { name: "Music", color: "#ff6b6b", emoji: "🎵", gradient: "linear-gradient(135deg, #ff6b6b, #ee5a52)" },
  { name: "Drawing", color: "#4ecdc4", emoji: "🎨", gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)" },
  { name: "Photography", color: "#45b7d1", emoji: "📸", gradient: "linear-gradient(135deg, #45b7d1, #3498db)" },
  { name: "Graphic", color: "#96ceb4", emoji: "🎭", gradient: "linear-gradient(135deg, #96ceb4, #85c1a3)" },
  { name: "Writing", color: "#ffeaa7", emoji: "✍️", gradient: "linear-gradient(135deg, #ffeaa7, #fdcb6e)" },
]

const StyledMenuItem = styled(motion.div)<{ color: string; gradient: string }>`
  width: 50px;
  height: 50px;
  background: ${(props) => props.gradient};
  border-radius: 15px;
  margin: 8px 0;
  border: 2px solid ${(props) => props.color};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px ${(props) => props.color}33;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

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
    transform: translateX(8px) scale(1.1);
    box-shadow: 0 6px 25px ${(props) => props.color}55;
    width: 60px;
    height: 60px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    &:hover {
      width: 45px;
      height: 45px;
      transform: translateX(5px) scale(1.05);
    }
  }
`

const EmojiIcon = styled(motion.span)`
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const Tooltip = styled(motion.div)<{ color: string }>`
  position: absolute;
  left: 70px;
  background: ${(props) => props.color};
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);

  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid ${(props) => props.color};
  }

  @media (max-width: 768px) {
    left: 55px;
    font-size: 12px;
    padding: 6px 10px;
  }
`

const MenuItemWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:hover ${Tooltip} {
    opacity: 1;
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
    <SidebarContainer initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.8, type: "spring" }}>
      <Menu
        mode="vertical"
        style={{
          background: "transparent",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
        selectable={false}
      >
        {subjects.map((subject, index) => (
          <Menu.Item
            key={subject.name}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              margin: 0,
              height: "auto",
              lineHeight: "normal",
            }}
          >
            <MenuItemWrapper>
              <StyledMenuItem
                color={subject.color}
                gradient={subject.gradient}
                onClick={() => handleMenuClick(subject.name)}
                initial={{ opacity: 0, scale: 0.3, x: -30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{
                  scale: 1.1,
                  x: 8,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <EmojiIcon
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  {subject.emoji}
                </EmojiIcon>
              </StyledMenuItem>

              <Tooltip
                color={subject.color}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0, x: 0 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {subject.name}
              </Tooltip>
            </MenuItemWrapper>
          </Menu.Item>
        ))}
      </Menu>
    </SidebarContainer>
  )
}

export default Navbar

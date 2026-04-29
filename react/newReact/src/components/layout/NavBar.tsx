"use client"

import type React from "react"
import { Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { StoreType } from "../../store/store"
import AppTag from "../common/AppTag"
import AppButton from "../common/AppButton"

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
// have to be taken from server side to avoid hydration mismatch






const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const categories = useSelector((state: StoreType) => state.categories.categories) || [];
  const handleMenuClick = (categoryName: string) => {
    const params = new URLSearchParams(location.search)
    params.set("subject", categoryName)
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
        {categories.map((category, index) => (
          <Menu.Item
            key={index}

          >
            <AppButton type="link" onClick={() => handleMenuClick(category.name)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>

              {category.name}
              <AppTag >{category.description}</AppTag>
            </AppButton>
          </Menu.Item>
        ))}
      </Menu>
    </SidebarContainer>
  )
}

export default Navbar





"use client"

import type React from "react"
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "antd"
import Navbar from "./NavBar"
import PaintingsPage from "./PaintingsPage"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store/store"
import { fetchPaintings } from "../store/axioscalls"
import PaintingComponent from "./PaintingComponent"
import { styled } from "styled-components"
import { motion } from "framer-motion"

const { Content } = Layout

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  position: relative;
  overflow-x: hidden;
`

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  margin-left: 80px; /* Space for sidebar */
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 60px;
  }
`

const SubApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchPaintings)
  }, [dispatch])

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Router>
        <Layout style={{ minHeight: "100vh", minWidth: "100vw", background: "transparent" }}>
          <Navbar />
          <Content style={{ padding: "20px", background: "transparent" }}>
            <ContentWrapper
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Routes>
                <Route path="/" element={<PaintingsPage />} />
                <Route path="/painting/:id" element={<PaintingComponent />} />
              </Routes>
            </ContentWrapper>
          </Content>
        </Layout>
      </Router>
    </PageContainer>
  )
}

export default SubApp

import type React from "react"
import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import { Layout } from "antd"

import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store/store"
import PaintingComponent from "./paintings/PaintingComponent"
import ProtectedRoute from "./auth/ProtectedRoute"
import StartPage from "./auth/StartPage"
import PaintingsPage from "./paintings/PaintingsPage"
import NavBarDraft from "./layout/NavBarDraft"
import { fetchPaintingsAsync } from "../store/paintingSlice"
import { themeToken } from "../theme/token"
import Sider from "antd/es/layout/Sider"

const { Content } = Layout



const SubApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchPaintingsAsync())
  }, [dispatch])
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  };
  return (
    
      <Layout hasSider style={{ minHeight: "100vh", maxWidth: "100vw", background: "transparent" }}>
        <Sider breakpoint="md"
           width={260} collapsed={collapsed} collapsible onCollapse={toggleCollapsed} style={siderStyle}>
          <NavBarDraft />
        </Sider>
        <Content style={{
          padding: themeToken.token?.padding, minHeight: "100%",
          flex: 1,    
          minWidth: 0,
          background: themeToken.token?.colorWarning
        }}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><PaintingsPage /></ProtectedRoute>} />
            <Route path="/painting/:id" element={<ProtectedRoute><PaintingComponent /></ProtectedRoute>} />
            <Route path="/login" element={<StartPage />} />
          </Routes>
        </Content>
      </Layout>
   
  )
}

export default SubApp




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
import Sider from "antd/es/layout/Sider"
// import { Header } from "antd/es/layout/layout"
// import UserProfileAvatar from "./user/UserProfileAvatar"





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
  <Layout
    hasSider
    style={{
      minHeight: "100vh",
      background: "#f5f5f5",
    }}
  >
    {/* <Header><UserProfileAvatar /></Header> */}
    <Sider
      breakpoint="md"
      width={240}
      collapsed={collapsed}
      collapsible
      onCollapse={toggleCollapsed}
      style={siderStyle}
    >
      <NavBarDraft />
    </Sider>

    <Layout
      style={{
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PaintingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/painting/:id"
            element={
              <ProtectedRoute>
                <PaintingComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<StartPage />} />
        </Routes>
      </div>
    </Layout>
  </Layout>
)
}

export default SubApp




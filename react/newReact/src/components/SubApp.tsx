
import type React from "react"
import { lazy, Suspense, useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { Layout, Spin, Typography } from "antd"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import NavBarDraft from "./layout/NavBarDraft"
import { fetchPaintingsAsync } from "../store/paintingSlice"
import Sider from "antd/es/layout/Sider"
import UserAvatar from "./user/UserAvatar"
import AppButton from "./common/AppButton"
import { themeToken } from "../theme/token"
import ProtectedRoute from "./auth/ProtectedRoute"
const PaintingComponent = lazy(() => import("./paintings/PaintingComponent"))
const StartPage = lazy(() => import("./auth/StartPage"))
const PaintingsPage = lazy(() => import("./paintings/PaintingsPage"));
const EditProfilePage = lazy(() => import("./user/EditProfilePage"));
const ProfilePage = lazy(() => import("./user/ProfilePage"));


const { Header, Content, Footer } = Layout

const SubApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: StoreType) => state.user.user);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchPaintingsAsync());
  }, [dispatch])

  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "calc(100vh - 64px)", // header height
    top: 0,
    position: "sticky",
    insetInlineStart: 0,
    background: themeToken?.token?.colorBgContainer,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
  }

  return (
    <Layout

      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >

      <Header
        style={{
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Typography.Title
            level={3}
            style={{
              margin: 0,
            }}
          >
            ArtSprint
          </Typography.Title>

          <AppButton
            type="link"
            onClick={() => navigate("/")}
          >
            Home
          </AppButton>
          {user?.role === "admin" && (
            <AppButton
              type="link"
              onClick={() => window.location.href = "https://artsprintadmin.onrender.com"}
            >
              Admin Panel
            </AppButton>
          )}
        </div>

        <UserAvatar />
      </Header>
      <Layout>

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
        <Content
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
            <Suspense fallback={<div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <Spin size="large" />
            </div>}>
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

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfilePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </Content>


      </Layout>
      <Footer
        style={{
          textAlign: "center",
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        ArtSprint © {new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default SubApp


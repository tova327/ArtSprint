"use client"

import { useState } from "react"
import { Button, Tooltip, notification } from "antd"
import styled from "styled-components"
import { motion } from "framer-motion"
import BreathtakingBackground from "./BreathtakingBackground"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import PaintingUploadModal from "./PaintingUploadModal"
import { useDispatch, useSelector } from "react-redux"
import { LoginAsync, RegisterAsync, type UserToAddType } from "../store/userSlice"
import { type PaintingToAddType, uploadPaintingAsync } from "../store/paintingSlice"
import type { AppDispatch, StoreType } from "../store/store"
import { InfoCircleOutlined, HeartOutlined, StarOutlined, ShakeOutlined } from "@ant-design/icons"
import axios from "axios"

const Welcome = styled(motion.h1)`
  font-weight: 900;
  font-size: 4rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  letter-spacing: 4px;
  text-align: center;
  text-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
`

const Blurb = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  margin: 32px 0;
  font-size: 1.4rem;
  font-weight: 600;
  max-width: 700px;
  line-height: 1.7;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`

const GlassContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(25px);
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 95%;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.8s;
  }

  &:hover::before {
    left: 100%;
  }
`

const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.7;
  color: #fff;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
`

const StyledButton = styled(Button)`
  height: 60px;
  font-size: 1.2rem;
  font-weight: 800;
  border-radius: 30px;
  padding: 0 40px;
  border: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }

  &.primary {
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
    color: white;
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    border: 3px solid rgba(255, 255, 255, 0.4);
  }
`

const StartPage = ({ toClose }: { toClose: Function }) => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((store: StoreType) => store.user.user)
  const token = useSelector((store: StoreType) => store.user.token)

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false)
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [mustUploadPainting, setMustUploadPainting] = useState(false)
  const [paintingUploadLoading, setPaintingUploadLoading] = useState(false)
  const [showPaintingModal, setShowPaintingModal] = useState(false)

  const openNotification = (type: "success" | "error", message: string, description: string) => {
    notification[type]({ message, description, duration: 4 })
  }

  const handleLoginOk = async (values: { username: string; password: string }) => {
    setLoginLoading(true)
    try {
      const result = await dispatch(LoginAsync({ user: values })).unwrap()
      setIsLoginModalVisible(false)
      console.log("before send to check painting "+user.id);

      await checkUserPainting(user.id)
      openNotification("success", "🎨 Welcome Back!", `Ready to create magic, ${result.name || values.username}?`)
    } catch (error: any) {
      openNotification("error", "❌ Login Failed", error?.message || "Invalid credentials.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (userDetails: UserToAddType) => {
    setRegisterLoading(true)
    try {
      await dispatch(RegisterAsync({ user: userDetails })).unwrap()
      setIsRegisterModalVisible(false)
      openNotification("success", "🌟 Welcome to ArtSprint!", "Time to share your first masterpiece!")
      await checkUserPainting(user.id)
    } catch (err: any) {
      openNotification("error", "❌ Registration Failed", err?.message || "Please try again.")
    } finally {
      setRegisterLoading(false)
    }
  }

  const checkUserPainting = async (userid: string | number) => {
     console.log("in check painting "+user.id);

    try {
      const res = await axios.get(`https://artsprintserver.onrender.com/api/Painting/user/${userid}`)
      if (!res.data || res.data.length === 0) {
        setMustUploadPainting(true)
        setShowPaintingModal(true)
      } else {
        toClose()
      }
    } catch {
      openNotification("error", "Error", "Failed to check paintings")
    }
  }

  const handleUploadPainting = async (paintingData: PaintingToAddType) => {
    setPaintingUploadLoading(true)
    try {
      await dispatch(uploadPaintingAsync({ painting: paintingData, token: token || "" })).unwrap()
      openNotification("success", "🎨 Masterpiece Uploaded!", "Your art is now part of our gallery!")
      setShowPaintingModal(false)
      setMustUploadPainting(false)
      toClose()
    } catch (err: any) {
      openNotification("error", "Upload Failed", err?.message || "Please try again.")
    } finally {
      setPaintingUploadLoading(false)
    }
  }

  const floatingIcons = [
    { icon: <HeartOutlined />, delay: 0, x: "8%", y: "15%" },
    { icon: <StarOutlined />, delay: 1, x: "88%", y: "25%" },
    { icon: <ShakeOutlined />, delay: 2, x: "12%", y: "75%" },
    { icon: <HeartOutlined />, delay: 0.5, x: "92%", y: "85%" },
    { icon: <StarOutlined />, delay: 1.5, x: "5%", y: "50%" },
    { icon: <ShakeOutlined />, delay: 2.5, x: "95%", y: "60%" },
  ]

  return (
    <div style={{ position: "relative", minHeight: "100vh", zIndex: 1 }}>
      <BreathtakingBackground />

      {floatingIcons.map((item, index) => (
        <FloatingIcon
          key={index}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          {item.icon}
        </FloatingIcon>
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "32px 16px",
        }}
      >
        <GlassContainer
          initial={{ opacity: 0, y: 80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, type: "spring" }}
        >
          <Welcome
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
          >
            ArtSprint
            <Tooltip title="Join our magical art community! ✨">
              <InfoCircleOutlined style={{ marginLeft: 16, color: "#4ecdc4", fontSize: 32 }} />
            </Tooltip>
          </Welcome>

          <Blurb
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            🎨 Share your art, discover masterpieces, and connect with creative souls from around the world! 🌟
          </Blurb>

          <ButtonGroup
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                className="primary"
                size="large"
                onClick={() => setIsLoginModalVisible(true)}
                loading={loginLoading}
              >
                🚀 Sign In
              </StyledButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <StyledButton
                className="secondary"
                size="large"
                onClick={() => setIsRegisterModalVisible(true)}
                loading={registerLoading}
              >
                ✨ Join Us
              </StyledButton>
            </motion.div>
          </ButtonGroup>

          {mustUploadPainting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              style={{
                marginTop: 40,
                background: "rgba(255, 107, 107, 0.2)",
                border: "3px solid rgba(255, 107, 107, 0.6)",
                borderRadius: 20,
                padding: 30,
                color: "#fff",
                fontWeight: 700,
                textAlign: "center",
                backdropFilter: "blur(15px)",
              }}
            >
              <motion.div
                style={{ marginBottom: 20, fontSize: "1.1rem" }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                🎨 Share your first masterpiece to complete your artistic journey!
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <StyledButton
                  className="primary"
                  onClick={() => setShowPaintingModal(true)}
                  loading={paintingUploadLoading}
                >
                  🖼️ Upload Art
                </StyledButton>
              </motion.div>
            </motion.div>
          )}
        </GlassContainer>
      </div>

      <LoginModal
        open={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onLogin={handleLoginOk}
        loading={loginLoading}
        switchToRegister={() => {
          setIsLoginModalVisible(false)
          setIsRegisterModalVisible(true)
        }}
      />

      <RegisterModal
        open={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        onRegister={handleRegister}
        loading={registerLoading}
      />

      <PaintingUploadModal
        visible={showPaintingModal}
        onCancel={() => setShowPaintingModal(false)}
        onUpload={handleUploadPainting}
        loading={paintingUploadLoading}
        userId={user?.id}
        token={token}
      />
    </div>
  )
}

export default StartPage

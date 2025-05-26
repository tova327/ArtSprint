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
import { InfoCircleOutlined, HeartOutlined, StarOutlined } from "@ant-design/icons"
import axios from "axios"

const Welcome = styled(motion.h1)`
  font-weight: 800;
  font-size: 3.5rem;
  background: linear-gradient(45deg, #ff4081, #ff9800, #56c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: 3px;
  text-align: center;
  text-shadow: 0 4px 20px rgba(255, 64, 129, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
`

const Blurb = styled(motion.p)`
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  margin: 24px 0;
  font-size: 1.3rem;
  font-weight: 500;
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`

const GlassContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 48px 32px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
`

const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  opacity: 0.6;
  color: #fff;
`

const StyledButton = styled(Button)`
  height: 56px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 28px;
  padding: 0 32px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }

  &.primary {
    background: linear-gradient(135deg, #ff4081, #ff9800);
    color: white;
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
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
      await checkUserPainting(user.id)
      openNotification("success", "Welcome Back!", `Glad to see you again, ${result.name || values.username}!`)
    } catch (error: any) {
      openNotification("error", "Login Failed", error?.message || "Invalid username or password.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (userDetails: UserToAddType) => {
    setRegisterLoading(true)
    try {
      await dispatch(RegisterAsync({ user: userDetails })).unwrap()
      setIsRegisterModalVisible(false)
      openNotification("success", "Registration Successful", "You can now upload your painting!")
      await checkUserPainting(user.id)
    } catch (err: any) {
      openNotification("error", "Register Failed", err?.message || "Please try again.")
    } finally {
      setRegisterLoading(false)
    }
  }

  const checkUserPainting = async (userid: string | number) => {
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
      openNotification("success", "Painting Uploaded", "Thank you for sharing your art!")
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
    { icon: <HeartOutlined />, delay: 0, x: "10%", y: "20%" },
    { icon: <StarOutlined />, delay: 1, x: "85%", y: "30%" },
    { icon: <HeartOutlined />, delay: 2, x: "15%", y: "70%" },
    { icon: <StarOutlined />, delay: 0.5, x: "90%", y: "80%" },
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
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
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
        <GlassContainer initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Welcome
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            ArtSprint
            <Tooltip title="This is your creative community – join us!">
              <InfoCircleOutlined style={{ marginLeft: 12, color: "#56c6ff", fontSize: 28 }} />
            </Tooltip>
          </Welcome>

          <Blurb initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
            Share, discover, and celebrate art in all its forms. Join our vibrant community of artists!
          </Blurb>

          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <StyledButton
              className="primary"
              size="large"
              onClick={() => setIsLoginModalVisible(true)}
              loading={loginLoading}
            >
              Sign In
            </StyledButton>
            <StyledButton
              className="secondary"
              size="large"
              onClick={() => setIsRegisterModalVisible(true)}
              loading={registerLoading}
            >
              Sign Up
            </StyledButton>
          </ButtonGroup>

          {mustUploadPainting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginTop: 32,
                background: "rgba(255, 255, 255, 0.15)",
                border: "2px solid rgba(255, 64, 129, 0.5)",
                borderRadius: 16,
                padding: 24,
                color: "#fff",
                fontWeight: 600,
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ marginBottom: 16 }}>You must upload at least one painting to complete your profile.</div>
              <StyledButton
                className="primary"
                onClick={() => setShowPaintingModal(true)}
                loading={paintingUploadLoading}
              >
                Upload Painting
              </StyledButton>
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

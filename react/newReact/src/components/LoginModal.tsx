"use client"

import { Modal, Form, Input, Button } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from "@ant-design/icons"
import { motion } from "framer-motion"
import styled from "styled-components"

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 30px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px);
    border: 3px solid rgba(255, 107, 107, 0.3);
    box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3);
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1);
    background-size: 200% 200%;
    animation: gradientShift 4s ease infinite;
    border: none;
    border-radius: 30px 30px 0 0;
    padding: 25px 30px;
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
      animation: shimmer 3s infinite;
    }
    
    .ant-modal-title {
      color: white;
      font-weight: 900;
      font-size: 2rem;
      text-align: center;
      text-shadow: 0 4px 15px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  }
  
  .ant-modal-body {
    padding: 40px 35px;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .ant-modal-close {
    top: 15px;
    right: 20px;
    color: white;
    font-size: 20px;
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    font-weight: 800;
    font-size: 16px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`

const StyledInput = styled(Input)`
  border-radius: 15px;
  height: 50px;
  font-size: 16px;
  border: 3px solid rgba(255, 107, 107, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:focus, &:hover {
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: rgba(102, 102, 102, 0.6);
    font-weight: 500;
  }
`

const StyledPasswordInput = styled(Input.Password)`
  border-radius: 15px;
  height: 50px;
  font-size: 16px;
  border: 3px solid rgba(255, 107, 107, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:focus, &:hover {
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    transform: translateY(-2px);
  }
  
  .ant-input {
    background: transparent;
    border: none;
    
    &::placeholder {
      color: rgba(102, 102, 102, 0.6);
      font-weight: 500;
    }
  }
`

const StyledButton = styled(Button)`
  height: 55px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 18px;
  border: none;
  position: relative;
  overflow: hidden;
  
  &.ant-btn-primary {
    background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
    background-size: 200% 200%;
    color: white;
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
    
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
      background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6);
      color: white;
    }
    
    &:active {
      transform: translateY(-1px) scale(1.01);
    }
  }
  
  &.ant-btn-link {
    color: #ff6b6b;
    font-weight: 700;
    font-size: 16px;
    height: auto;
    padding: 8px 0;
    
    &:hover {
      color: #4ecdc4;
      transform: scale(1.05);
    }
  }
`

const WelcomeText = styled(motion.div)`
  text-align: center;
  margin-bottom: 30px;
  
  h3 {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 900;
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 16px;
    font-weight: 600;
  }
`

const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.6;
  color: #ff6b6b;
`

const LoginModal = ({
  open,
  onCancel,
  onLogin,
  loading,
  switchToRegister,
}: {
  open: boolean
  onCancel: () => void
  onLogin: (values: { username: string; password: string }) => Promise<void>
  loading: boolean
  switchToRegister: () => void
}) => (
  <StyledModal
    title={
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        🎨 Welcome Back!
      </motion.div>
    }
    open={open}
    onCancel={onCancel}
    footer={null}
    destroyOnClose
    centered
    width={500}
  >
    <div style={{ position: "relative" }}>
      {/* Floating decorative elements */}
      <FloatingIcon
        style={{ top: "10px", right: "20px" }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        ✨
      </FloatingIcon>

      <FloatingIcon
        style={{ bottom: "20px", left: "15px" }}
        animate={{
          y: [0, -10, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        🎭
      </FloatingIcon>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <WelcomeText
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3>Ready to Create Magic? ✨</h3>
          <p>Sign in to your artistic journey</p>
        </WelcomeText>

        <Form layout="vertical" onFinish={onLogin}>
          <StyledFormItem
            name="username"
            label={
              <span>
                <UserOutlined style={{ color: "#ff6b6b" }} />
                Username
              </span>
            }
            rules={[{ required: true, message: "Please input your username!" }]}
            hasFeedback
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <StyledInput placeholder="Enter your creative username..." size="large" />
            </motion.div>
          </StyledFormItem>

          <StyledFormItem
            name="password"
            label={
              <span>
                <LockOutlined style={{ color: "#4ecdc4" }} />
                Password
              </span>
            }
            rules={[{ required: true, message: "Please input your password!" }]}
            hasFeedback
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <StyledPasswordInput
                placeholder="Your secret key to creativity..."
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </motion.div>
          </StyledFormItem>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <StyledButton
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              style={{ width: "100%", marginBottom: 20 }}
            >
              {loading ? "🎨 Signing In..." : "🚀 Let's Create!"}
            </StyledButton>
          </motion.div>

          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <span style={{ color: "#666", fontWeight: 600 }}>New to our creative community? </span>
            <StyledButton type="link" onClick={switchToRegister}>
              ✨ Join the Magic
            </StyledButton>
          </motion.div>
        </Form>
      </motion.div>
    </div>
  </StyledModal>
)

export default LoginModal

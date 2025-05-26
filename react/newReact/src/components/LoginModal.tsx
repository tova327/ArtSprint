"use client"

import { Modal, Form, Input, Button } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"
import { motion } from "framer-motion"
import styled from "styled-components"

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #ff4081, #ff9800);
    border: none;
    
    .ant-modal-title {
      color: white;
      font-weight: 700;
      font-size: 1.5rem;
    }
  }
`

const StyledButton = styled(Button)`
  height: 48px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  
  &.ant-btn-primary {
    background: linear-gradient(135deg, #ff4081, #ff9800);
    border: none;
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 64, 129, 0.4);
    }
  }
  
  &.ant-btn-link {
    color: #ff4081;
    font-weight: 600;
    
    &:hover {
      color: #ff9800;
    }
  }
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
  <StyledModal title="Welcome Back!" open={open} onCancel={onCancel} footer={null} destroyOnClose centered>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Form layout="vertical" onFinish={onLogin}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
          hasFeedback
        >
          <Input placeholder="Username" style={{ borderRadius: 12, height: 40 }} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password
            placeholder="Password"
            style={{ borderRadius: 12, height: 40 }}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <Form.Item>
          <StyledButton type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Logging in..." : "Log In"}
          </StyledButton>
        </Form.Item>
        <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
          <span style={{ color: "#888" }}>
            New here?{" "}
            <StyledButton type="link" onClick={switchToRegister}>
              Create an account
            </StyledButton>
          </span>
        </Form.Item>
      </Form>
    </motion.div>
  </StyledModal>
)

export default LoginModal

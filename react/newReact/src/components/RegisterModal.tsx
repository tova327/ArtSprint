"use client"

import type React from "react"

import { useState } from "react"
import { Modal, Form, Input, DatePicker, Button, Spin, Tooltip, Radio } from "antd"
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CalendarOutlined,
  CloudUploadOutlined,
  FileImageOutlined,
  FileTextOutlined,
  SoundOutlined,
} from "@ant-design/icons"
import { ESubject } from "../store/paintingSlice"
import { getTest, checkAnswers } from "../store/axioscalls"
import { motion } from "framer-motion"
import styled from "styled-components"
import './CSSPages/RegisterModal.css'

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 30px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px);
    border: 3px solid rgba(76, 201, 196, 0.3);
    box-shadow: 0 20px 60px rgba(76, 201, 196, 0.3);
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #4ecdc4, #45b7d1, #96ceb4);
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

const StyledButton = styled(Button)`
  height: 55px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 18px;
  border: none;
  position: relative;
  overflow: hidden;
  
  &.ant-btn-primary {
    background: linear-gradient(135deg, #4ecdc4, #45b7d1);
    background-size: 200% 200%;
    color: white;
    box-shadow: 0 8px 25px rgba(76, 201, 196, 0.4);
    
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
      background: linear-gradient(135deg, #45b7d1, #4ecdc4);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(76, 201, 196, 0.6);
      color: white;
    }
  }
`

const StyledInput = styled(Input)`
  border-radius: 15px;
  height: 50px;
  font-size: 16px;
  border: 3px solid rgba(76, 201, 196, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:focus, &:hover {
    border-color: #4ecdc4;
    box-shadow: 0 0 0 3px rgba(76, 201, 196, 0.2);
    transform: translateY(-2px);
  }
`

const StyledPasswordInput = styled(Input.Password)`
  border-radius: 15px;
  height: 50px;
  font-size: 16px;
  border: 3px solid rgba(76, 201, 196, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:focus, &:hover {
    border-color: #4ecdc4;
    box-shadow: 0 0 0 3px rgba(76, 201, 196, 0.2);
    transform: translateY(-2px);
  }
  
  .ant-input {
    background: transparent;
    border: none;
  }
`

// const StyledDatePicker = styled(DatePicker)`
//   border-radius: 15px;
//   height: 50px;
//   font-size: 16px;
//   border: 3px solid rgba(76, 201, 196, 0.3);
//   background: rgba(255, 255, 255, 0.9);
//   transition: all 0.3s ease;

  
//   &:focus, &:hover {
//     border-color: #4ecdc4;
//     box-shadow: 0 0 0 3px rgba(76, 201, 196, 0.2);
//     transform: translateY(-2px);
//   }
// `



const StyledTextArea = styled(Input.TextArea)`
  border-radius: 15px;
  font-size: 16px;
  border: 3px solid rgba(76, 201, 196, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:focus, &:hover {
    border-color: #4ecdc4;
    box-shadow: 0 0 0 3px rgba(76, 201, 196, 0.2);
    transform: translateY(-2px);
  }
`

const StepIndicator = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 15px;
`

const StepDot = styled(motion.div) <{ active: boolean; completed: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) =>
    props.completed
      ? "linear-gradient(135deg, #96ceb4, #4ecdc4)"
      : props.active
        ? "linear-gradient(135deg, #4ecdc4, #45b7d1)"
        : "#ddd"};
  transition: all 0.3s ease;
  position: relative;
  
  ${(props) =>
    props.completed &&
    `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 10px;
      font-weight: bold;
    }
  `}
`

const StepTitle = styled(motion.h3)`
  text-align: center;
  margin-bottom: 25px;
  font-weight: 900;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const FloatingIcon = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.6;
  color: #4ecdc4;
`

const RegisterModal = ({
  open,
  onCancel,
  onRegister,
  loading,
}: {
  open: boolean
  onCancel: () => void
  onRegister: (userDetails: any) => Promise<void>
  loading: boolean
}) => {
  const [step, setStep] = useState(1)
  const [detailsForm] = Form.useForm()
  const [registerDetails, setRegisterDetails] = useState<any>(null)
  const [subject, setSubject] = useState<string>("")
  const [questions, setQuestions] = useState<string[]>([])
  const [, setAnswers] = useState<string[]>([])
  const [questionLoading, setQuestionLoading] = useState(false)
  const [checkingAnswers, setCheckingAnswers] = useState(false)

  const handleStep1 = (values: any) => {
    setRegisterDetails(values)
    setStep(2)
  }

  const handleStep2 = async (values: any) => {
    setSubject(values.subject)
    setQuestionLoading(true)
    try {
      const qs = await getTest(values.subject)
      setQuestions(qs)
      setStep(3)
    } finally {
      setQuestionLoading(false)
    }
  }

  const handleStep3 = async (values: any) => {
    const userAnswers = questions.map((_, i) => values[`answer_${i}`])
    setAnswers(userAnswers)
    setCheckingAnswers(true)
    try {
      const result = await checkAnswers({ subject, questions, answers: userAnswers })
      if (result.result === "yes") {
        await onRegister({ ...registerDetails, subject, answers: userAnswers })
      } else {
        Modal.error({
          title: "🎭 Not Quite There Yet",
          content: "Your artistic knowledge needs a bit more development. Keep creating and try again!",
          centered: true,
        })
        onCancel()
      }
    } finally {
      setCheckingAnswers(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "🎨 Tell Us About Yourself"
      case 2:
        return "🎭 Choose Your Art Form"
      case 3:
        return "📝 Show Your Expertise"
      default:
        return "✨ Join Our Community"
    }
  }
  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Music":
        return <SoundOutlined />
      case "Photography":
      case "Drawing":
      case "Graphic":
        return <FileImageOutlined />
      case "Writing":
        return <FileTextOutlined />
      default:
        return <CloudUploadOutlined />
    }
  }
  let content: React.ReactNode
  if (step === 1) {
    content = (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <Form form={detailsForm} layout="vertical" onFinish={handleStep1}>
          <Form.Item
            name="name"
            label={
              <span>
                <UserOutlined style={{ color: "#4ecdc4" }} /> Full Name
              </span>
            }
            rules={[{ required: true, message: "Please input your name!" }]}
            hasFeedback
          >
            <StyledInput placeholder="Your beautiful name..." />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span>
                <MailOutlined style={{ color: "#45b7d1" }} /> Email
              </span>
            }
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            hasFeedback
          >
            <StyledInput placeholder="your.email@creativity.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span>
                <LockOutlined style={{ color: "#96ceb4" }} /> Password
              </span>
            }
            rules={[{ required: false, message: "Please input your password!" }]}
            hasFeedback
          >
            <StyledPasswordInput
              placeholder="Create a strong password..."
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label={
              <span>
                <CalendarOutlined style={{ color: "#ffeaa7" }} /> Birth Date{" "}
                <Tooltip title="You must be at least 13 years old to join our creative community.">
                  <InfoCircleOutlined style={{ color: "#ff6b6b" }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Please select your birth date!" }]}
            hasFeedback
          >
            <DatePicker
              className="my-custom-datepicker"
              placeholder="When were you born?"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="subject"
            label={<span style={{ fontWeight: 800, fontSize: 16, color: "#333" }}>🎭 Choose Your Art Category</span>}
            rules={[{ required: true, message: "Please select a subject!" }]}
          >
            <Radio.Group style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {ESubject.map((subject) => (
                <Radio.Button key={subject} value={subject} style={{
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: 8,
                }}>
                  <span style={{ marginRight: 6 }}>{getSubjectIcon(subject)}</span>
                  <span>{subject}</span>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          <StyledButton type="primary" htmlType="submit" style={{ width: "100%" }}>
            🚀 Next Step
          </StyledButton>
        </Form>
      </motion.div>
    )
  } else if (step === 2) {
    content = (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <motion.div
          style={{
            textAlign: "center",
            marginBottom: 30,
            padding: 25,
            background: "linear-gradient(135deg, rgba(76, 201, 196, 0.1), rgba(69, 183, 209, 0.1))",
            borderRadius: 20,
            border: "2px solid rgba(76, 201, 196, 0.3)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h4 style={{ color: "#4ecdc4", fontWeight: 800, fontSize: "1.3rem", marginBottom: 10 }}>
            🎯 Confirm Your Expertise
          </h4>
          <p style={{ color: "#666", fontWeight: 600 }}>
            We'll test your knowledge to ensure you're ready to share amazing art!
          </p>
        </motion.div>

        <Form layout="vertical" onFinish={handleStep2}>
          <Form.Item
            name="subject"
            label={<span style={{ fontWeight: 800, fontSize: 16, color: "#333" }}>🎭 Choose Your Art Category</span>}
            rules={[{ required: true, message: "Please select a subject!" }]}
          >
            <Radio.Group style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {ESubject.map((subject) => (
                <Radio.Button key={subject} value={subject} style={{
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 16px",
                  borderRadius: 8,
                }}>
                  <span style={{ marginRight: 6 }}>{getSubjectIcon(subject)}</span>
                  <span>{subject}</span>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          <StyledButton type="primary" htmlType="submit" style={{ width: "100%" }} loading={questionLoading}>
            {questionLoading ? "🎨 Preparing Questions..." : "📝 Get My Test"}
          </StyledButton>
        </Form>
      </motion.div>
    )
  } else if (step === 3) {
    content = (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <motion.div
          style={{
            textAlign: "center",
            marginBottom: 25,
            padding: 20,
            background: "linear-gradient(135deg, rgba(255, 234, 167, 0.3), rgba(150, 206, 180, 0.3))",
            borderRadius: 15,
            border: "2px solid rgba(255, 234, 167, 0.5)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p style={{ color: "#666", fontWeight: 700, margin: 0 }}>
            🌟 Show us your expertise! Answer these questions to join our community.
          </p>
        </motion.div>

        <Form layout="vertical" onFinish={handleStep3}>
          {questions.map((q, i) => (
            <Form.Item
              key={i}
              name={`answer_${i}`}
              label={
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                  <span
                    style={{
                      background: "linear-gradient(45deg, #4ecdc4, #45b7d1)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      marginRight: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Q{i + 1}
                  </span>
                  {q}
                </span>
              }
              rules={[{ required: true, message: "Please provide an answer!" }]}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
              >
                <StyledTextArea
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  placeholder="Share your knowledge and creativity..."
                />
              </motion.div>
            </Form.Item>
          ))}

          <StyledButton type="primary" htmlType="submit" style={{ width: "100%" }} loading={checkingAnswers || loading}>
            {checkingAnswers || loading ? "🎨 Reviewing Your Answers..." : "✨ Join the Community!"}
          </StyledButton>
        </Form>
      </motion.div>
    )
  }

  return (
    <StyledModal
      title={
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          🌟 Join Our Creative Family!
        </motion.div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
      width={650}
    >
      <div style={{ position: "relative" }}>
        {/* Floating decorative elements */}
        <FloatingIcon
          style={{ top: "10px", right: "20px" }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          🎨
        </FloatingIcon>

        <FloatingIcon
          style={{ bottom: "20px", left: "15px" }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          🌟
        </FloatingIcon>

        <StepIndicator>
          {[1, 2, 3].map((stepNum) => (
            <StepDot
              key={stepNum}
              active={step === stepNum}
              completed={step > stepNum}
              animate={{
                scale: step === stepNum ? 1.3 : 1,
                rotate: step > stepNum ? 360 : 0,
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </StepIndicator>

        <StepTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          key={step}
        >
          {getStepTitle()}
        </StepTitle>

        <Spin spinning={loading} tip="Creating your artistic profile...">
          {content}
        </Spin>
      </div>
    </StyledModal>
  )
}

export default RegisterModal

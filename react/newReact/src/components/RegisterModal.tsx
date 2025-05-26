"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Form, Input, DatePicker, Button, Select, Spin, Tooltip } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from "@ant-design/icons"
import { ESubject } from "../store/paintingSlice"
import { getTest, checkAnswers } from "../store/axioscalls"
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
    background: linear-gradient(135deg, #29d98c, #56c6ff);
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
    background: linear-gradient(135deg, #29d98c, #56c6ff);
    border: none;
    box-shadow: 0 4px 15px rgba(41, 217, 140, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(41, 217, 140, 0.4);
    }
  }
`

const StepIndicator = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  gap: 12px;
`

const StepDot = styled(motion.div)<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => (props.active ? "linear-gradient(135deg, #29d98c, #56c6ff)" : "#ddd")};
  transition: all 0.3s ease;
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
          title: "Not Accepted",
          content: "Sorry, your answers did not meet our requirements.",
          centered: true,
        })
        onCancel()
      }
    } finally {
      setCheckingAnswers(false)
    }
  }

  let content: React.ReactNode
  if (step === 1) {
    content = (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <Form form={detailsForm} layout="vertical" onFinish={handleStep1} initialValues={{}}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please input your name!" }]}
            hasFeedback
          >
            <Input placeholder="Your full name" style={{ borderRadius: 12, height: 40 }} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
            hasFeedback
          >
            <Input placeholder="Email" style={{ borderRadius: 12, height: 40 }} />
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
          <Form.Item
            name="birthDate"
            label={
              <span>
                Birth Date&nbsp;
                <Tooltip title="You must be at least 13 years old to join.">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Please select your birth date!" }]}
            hasFeedback
          >
            <DatePicker placeholder="Birth Date" style={{ width: "100%", borderRadius: 12, height: 40 }} />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Area of Expertise"
            rules={[{ required: true, message: "Please choose your subject!" }]}
          >
            <Select placeholder="Choose your expert subject" style={{ borderRadius: 12 }}>
              {ESubject.map((subj, idx) => (
                <Select.Option key={idx} value={subj}>
                  {subj}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit" style={{ width: "100%" }}>
              Next Step
            </StyledButton>
          </Form.Item>
        </Form>
      </motion.div>
    )
  } else if (step === 2) {
    content = (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <Form layout="vertical" onFinish={handleStep2}>
          <Form.Item
            name="subject"
            label="Confirm Area of Expertise"
            rules={[{ required: true, message: "Please choose your subject!" }]}
            initialValue={registerDetails?.subject}
          >
            <Select placeholder="Choose your expert subject" style={{ borderRadius: 12 }}>
              {ESubject.map((subj, idx) => (
                <Select.Option key={idx} value={subj}>
                  {subj}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit" style={{ width: "100%" }} loading={questionLoading}>
              {questionLoading ? "Getting Questions..." : "Get Test Questions"}
            </StyledButton>
          </Form.Item>
        </Form>
      </motion.div>
    )
  } else if (step === 3) {
    content = (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <Form layout="vertical" onFinish={handleStep3}>
          {questions.map((q, i) => (
            <Form.Item
              key={i}
              name={`answer_${i}`}
              label={`Q${i + 1}: ${q}`}
              rules={[{ required: true, message: "Please provide an answer!" }]}
            >
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} style={{ borderRadius: 12 }} />
            </Form.Item>
          ))}
          <Form.Item>
            <StyledButton
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={checkingAnswers || loading}
            >
              {checkingAnswers || loading ? "Checking..." : "Submit & Register"}
            </StyledButton>
          </Form.Item>
        </Form>
      </motion.div>
    )
  }

  return (
    <StyledModal
      title="Join Our Community!"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      centered
      width={600}
    >
      <StepIndicator>
        {[1, 2, 3].map((stepNum) => (
          <StepDot
            key={stepNum}
            active={step >= stepNum}
            animate={{ scale: step === stepNum ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </StepIndicator>

      <Spin spinning={loading}>{content}</Spin>
    </StyledModal>
  )
}

export default RegisterModal

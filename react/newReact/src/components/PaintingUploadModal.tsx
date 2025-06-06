"use client"

import { Modal, Form, Input, Radio, Upload, Button, Progress } from "antd"
import { CloudUploadOutlined, FileImageOutlined, SoundOutlined, FileTextOutlined } from "@ant-design/icons"
import { ESubject } from "../store/paintingSlice"
import { useState, useEffect } from "react"
import type { PaintingToAddType } from "../store/paintingSlice"
import { motion } from "framer-motion"
import styled from "styled-components"
import type { UploadFile } from "antd/es/upload/interface"

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px);
    border: 3px solid rgba(122, 66, 244, 0.3);
    box-shadow: 0 20px 60px rgba(122, 66, 244, 0.3);
  }
  .ant-modal-header {
    background: linear-gradient(135deg, #7a42f4, #ff6b6b, #4ecdc4);
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
    background: linear-gradient(135deg, #7a42f4, #ff6b6b);
    background-size: 200% 200%;
    color: white;
    box-shadow: 0 8px 25px rgba(122, 66, 244, 0.4);
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
      background: linear-gradient(135deg, #ff6b6b, #7a42f4);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(122, 66, 244, 0.6);
      color: white;
    }
  }
`
const StyledInput = styled(Input)`
  border-radius: 15px;
  height: 50px;
  font-size: 16px;
  border: 3px solid rgba(122, 66, 244, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  &:focus, &:hover {
    border-color: #7a42f4;
    box-shadow: 0 0 0 3px rgba(122, 66, 244, 0.2);
    transform: translateY(-2px);
  }
  &::placeholder {
    color: rgba(102, 102, 102, 0.6);
    font-weight: 500;
  }
`
const UploadArea = styled(motion.div)`
  border: 3px dashed rgba(122, 66, 244, 0.4);
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, rgba(122, 66, 244, 0.05), rgba(255, 107, 107, 0.05));
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #7a42f4;
    background: linear-gradient(135deg, rgba(122, 66, 244, 0.1), rgba(255, 107, 107, 0.1));
    transform: translateY(-2px);
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(122, 66, 244, 0.2), transparent);
    transition: left 0.8s;
  }
  &:hover::before {
    left: 100%;
  }
`
const UploadIcon = styled(motion.div)`
  font-size: 3rem;
  margin-bottom: 15px;
  color: #7a42f4;
`
const WelcomeText = styled(motion.div)`
  text-align: center;
  margin-bottom: 30px;
  h3 {
    background: linear-gradient(45deg, #7a42f4, #ff6b6b);
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
  color: #7a42f4;
`
const FileTypeHint = styled(motion.div)`
  margin-top: 15px;
  padding: 15px;
  background: rgba(122, 66, 244, 0.1);
  border-radius: 12px;
  border: 2px solid rgba(122, 66, 244, 0.2);
  h4 {
    color: #7a42f4;
    font-weight: 800;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  p {
    color: #666;
    margin: 0;
    font-weight: 600;
  }
`

const ProgressContainer = styled(motion.div)`
  margin: 20px 0;
  padding: 20px;
  background: rgba(122, 66, 244, 0.05);
  border-radius: 15px;
  border: 2px solid rgba(122, 66, 244, 0.2);
  text-align: center;
`

const ProgressText = styled(motion.div)`
  color: #7a42f4;
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const StyledProgress = styled(Progress)`
  .ant-progress-bg {
    background: linear-gradient(135deg, #7a42f4, #ff6b6b) !important;
  }

  .ant-progress-text {
    color: #7a42f4 !important;
    font-weight: 800 !important;
  }
`

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

const getAcceptedFiles = (subject: string) => {
  switch (subject) {
    case "Music":
      return "Audio files (.mp3)"
    case "Photography":
    case "Drawing":
    case "Graphic":
      return "Image files (.png, .jpg, .jpeg, .gif)"
    case "Writing":
      return "Document files (.pdf)"
    default:
      return "Select a category first"
  }
}

const acceptType = (subject: string) => {
  switch (subject) {
    case "Music": return ".mp3"
    case "Photography":
    case "Drawing":
    case "Graphic": return ".png,.jpg,.jpeg,.gif"
    case "Writing": return ".pdf"
    default: return "*"
  }
}

const PaintingUploadModal = ({ visible, onCancel, onUpload, loading, userId }: any) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [paintingFile, setPaintingFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const selectedSubject = Form.useWatch("subject", form)

  // Reset form and file state on modal close
  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setPaintingFile(null)
      setFileList([])
      setUploadProgress(0)
      setIsUploading(false)
    }
  }, [visible])

  // When subject changes, clear file states
  useEffect(() => {
    setPaintingFile(null)
    setFileList([])
    form.setFieldValue("paintingFile", [])
  }, [selectedSubject])

  // File upload handler
  const handleFileChange = (info: any) => {
    let newFileList = info.fileList.slice(-1) // Only keep the latest file
    setFileList(newFileList)

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      setPaintingFile(newFileList[0].originFileObj)
      // For AntD form validation
      form.setFields([{ name: "paintingFile", errors: [] }])
    } else {
      setPaintingFile(null)
    }
  }

  // Form submit handler
  const handleUpload = async (values: any) => {
    if (!paintingFile) {
      form.setFields([{ name: "paintingFile", errors: ["Please upload a file!"] }])
      return
    }
    setIsUploading(true)
    setUploadProgress(0)
    let interval: number | null = null;

    try {
      interval = window.setInterval(() => {
        setUploadProgress(prev => prev >= 90 ? 90 : prev + Math.random() * 15)
      }, 200)

      await onUpload({
        ownerId: userId,
        name: values.name,
        subject: values.subject,
        paintingFile,
      } as PaintingToAddType)

      if (interval) clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setPaintingFile(null)
        setFileList([])
        form.resetFields()
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (error) {
      if (interval) clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <StyledModal
      title={
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          🎨 Share Your Masterpiece
        </motion.div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      centered
      width={600}
      style={{ zIndex: 1001 }}
    >
      <div style={{ position: "relative" }}>
        {/* Floating decorative elements */}
        <FloatingIcon style={{ top: "10px", right: "20px" }} animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}>🎭</FloatingIcon>
        <FloatingIcon style={{ bottom: "20px", left: "15px" }} animate={{ y: [0, -10, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}>✨</FloatingIcon>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <WelcomeText initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}>
            <h3>Ready to Inspire the World? 🌟</h3>
            <p>Upload your creative masterpiece and let it shine!</p>
          </WelcomeText>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpload}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label={<span style={{ fontWeight: 800, fontSize: 16, color: "#333" }}>🖼️ Give Your Art a Beautiful Name</span>}
              rules={[{ required: true, message: "Please input the painting name!" }]}
            >
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                <StyledInput placeholder="What should we call this masterpiece?" />
              </motion.div>
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
            {selectedSubject && (
              <FileTypeHint initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h4>{getSubjectIcon(selectedSubject)}Accepted File Types</h4>
                <p>{getAcceptedFiles(selectedSubject)}</p>
              </FileTypeHint>
            )}
            <Form.Item
              name="paintingFile"
              label={<span style={{ fontWeight: 800, fontSize: 16, color: "#333" }}>📁 Upload Your Creation</span>}
              rules={[
                {
                  validator: (_, value) => {
                    if (paintingFile || (value && value.length > 0)) return Promise.resolve()
                    return Promise.reject(new Error("Please upload a file!"))
                  },
                },
              ]}
              valuePropName="fileList"
              getValueFromEvent={e => e && e.fileList}
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <Upload
                  name="file"
                  listType="picture"
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={handleFileChange}
                  accept={acceptType(selectedSubject)}
                >
                  <UploadArea whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <UploadIcon animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      <CloudUploadOutlined />
                    </UploadIcon>
                    <h3 style={{ color: "#7a42f4", fontWeight: 800, marginBottom: 8 }}>
                      Drop your art here or click to browse
                    </h3>
                    <p style={{ color: "#666", fontWeight: 600, margin: 0 }}>
                      {selectedSubject ? getAcceptedFiles(selectedSubject) : "Choose a category first"}
                    </p>
                  </UploadArea>
                </Upload>
              </motion.div>
            </Form.Item>
            {isUploading && (
              <ProgressContainer initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <ProgressText animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    🎨
                  </motion.span>
                  Uploading your masterpiece...
                </ProgressText>
                <StyledProgress
                  percent={Math.round(uploadProgress)}
                  status={uploadProgress === 100 ? "success" : "active"}
                  strokeWidth={8}
                  showInfo={true}
                  format={percent => `${percent}%`}
                />
                {uploadProgress === 100 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 10, color: "#29d98c", fontWeight: 800, fontSize: 14 }}>
                    ✨ Upload complete! Your art is now live! ✨
                  </motion.div>
                )}
              </ProgressContainer>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              <StyledButton
                type="primary"
                htmlType="submit"
                 style={{ width: "100%" }}
                loading={loading || isUploading}
                disabled={!paintingFile || isUploading}>
                {isUploading
                  ? `🎨 Uploading... ${Math.round(uploadProgress)}%`
                  : loading
                    ? "🎨 Uploading Magic..."
                    : "🚀 Share with the World!"}
              </StyledButton>
            </motion.div>
          </Form>
        </motion.div>
      </div>
    </StyledModal>
  )
}
 
export default PaintingUploadModal
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Button, Modal, Form, Input, Upload, Select, message, Spin, notification } from "antd"
import type { AppDispatch, StoreType } from "../store/store"
import { ESubject, fetchPaintingsAsync, type PaintingType, uploadPaintingAsync } from "../store/paintingSlice"
import ShowPainting from "./ShowPainting"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"
import PopularPaintings from "./PopularPaintings"
import LatestPaintings from "./LatestPaintings"
import { PlusOutlined } from "@ant-design/icons"

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 32px 6vw 0 6vw;
  display: flex;
  flex-direction: column;
  position: relative;
  
  @media (max-width: 900px) {
    padding: 24px 2vw 0 2vw;
  }
  @media (max-width: 600px) {
    padding: 12px 0 0 0;
  }
`

const PageTitle = styled(motion.h1)`
  text-align: center;
  margin-bottom: 32px;
  font-weight: 800;
  font-size: 3.2rem;
  letter-spacing: 3px;
  background: linear-gradient(45deg, #ff4081, #ff9800, #56c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(255, 64, 129, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`

const UploadButton = styled(motion(Button))`
  border-radius: 20px;
  border: 3px solid #ff4081;
  background: linear-gradient(135deg, #ff4081, #ff9800);
  color: white;
  font-weight: 700;
  font-size: 16px;
  height: 56px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(255, 64, 129, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 64, 129, 0.4);
    border-color: #ff4081;
    background: linear-gradient(135deg, #ff4081, #ff9800);
    color: white;
  }
`

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const PaintingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const paintings = useSelector((store: StoreType) => store.painting.paintings)
  const token = useSelector((store: StoreType) => store.user.token)
  const userId = useSelector((store: StoreType) => store.user.user.id)
  const loading = useSelector((store: StoreType) => store.painting.loading)
  const error = useSelector((store: StoreType) => store.painting.error)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [acceptedFileTypes, setAcceptedFileTypes] = useState<string[]>([])

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const subjectFilter = query.get("subject")

  useEffect(() => {
    dispatch(fetchPaintingsAsync())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error,
        duration: 4,
      })
    }
  }, [error])

  const handleUpload = async (values: any) => {
    const paintingData = {
      ownerId: userId,
      name: values.name,
      subject: values.subject,
      paintingFile: values.paintingFile[0].originFileObj,
    }
    const resultAction = await dispatch(uploadPaintingAsync({ painting: paintingData, token: token || "" }))
    if (uploadPaintingAsync.fulfilled.match(resultAction)) {
      message.success("Painting uploaded successfully!")
      setIsModalVisible(false)
      form.resetFields()
    } else {
      message.error("Failed to upload painting")
    }
  }

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)

  const handleSubjectChange = (value: number) => {
    const valueSwitch = ESubject[value]
    switch (valueSwitch) {
      case "Music":
        setAcceptedFileTypes([".mp3"])
        break
      case "Photography":
      case "Drawing":
      case "Graphic":
        setAcceptedFileTypes([".png", ".jpg", ".jpeg", ".gif"])
        break
      case "Writing":
        setAcceptedFileTypes([".pdf"])
        break
      default:
        setAcceptedFileTypes([])
    }
  }

  const subjectOptions = ESubject.map((subject, index) => (
    <Select.Option key={index} value={index}>
      {subject}
    </Select.Option>
  ))

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      {loading && (
        <LoadingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Spin size="large" tip="Loading amazing art..." />
          <motion.p
            style={{ marginTop: 16, color: "#666", fontSize: 16 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Preparing your gallery experience...
          </motion.p>
        </LoadingOverlay>
      )}

      <PageTitle initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        Art Gallery
      </PageTitle>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <PopularPaintings />
      </motion.div>

      <UploadButton
        type="primary"
        onClick={showModal}
        icon={<PlusOutlined />}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Upload New Masterpiece
      </UploadButton>

      <Modal
        title={
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              background: "linear-gradient(45deg, #ff4081, #ff9800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Upload New Painting
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        style={{ borderRadius: 16 }}
      >
        <Form form={form} onFinish={handleUpload} layout="vertical">
          <Form.Item
            name="name"
            label="Painting Name"
            rules={[{ required: true, message: "Please input the painting name!" }]}
          >
            <Input style={{ borderRadius: 12, height: 40 }} />
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Please select a subject!" }]}>
            <Select onChange={handleSubjectChange} style={{ borderRadius: 12 }}>
              {subjectOptions}
            </Select>
          </Form.Item>
          <Form.Item
            name="paintingFile"
            label="Painting File"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: "Please upload a file!" }]}
          >
            <Upload
              beforeUpload={() => false}
              accept={acceptedFileTypes.join(",")}
              maxCount={1}
              style={{ borderRadius: 12 }}
            >
              <Button style={{ borderRadius: 12, height: 40 }}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #ff4081, #ff9800)",
                border: "none",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
        <Row gutter={[28, 28]} style={{ marginTop: 8 }}>
          {paintings
            .filter((p: PaintingType) => !subjectFilter || ESubject[p.subject] === subjectFilter)
            .map((painting: PaintingType, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={painting.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ShowPainting painting={painting} />
                </motion.div>
              </Col>
            ))}
        </Row>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <LatestPaintings />
      </motion.div>
    </PageContainer>
  )
}

export default PaintingsPage

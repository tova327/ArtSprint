"use client"

import { Modal, Form, Input, Select, Upload, Button } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { ESubject } from "../store/paintingSlice"
import { useState } from "react"
import type { PaintingToAddType } from "../store/paintingSlice"
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
    background: linear-gradient(135deg, #7a42f4, #ff4081);
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
    background: linear-gradient(135deg, #7a42f4, #ff4081);
    border: none;
    box-shadow: 0 4px 15px rgba(122, 66, 244, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(122, 66, 244, 0.4);
    }
  }
`

const PaintingUploadModal = ({ visible, onCancel, onUpload, loading, userId }: any) => {
  const [form] = Form.useForm()
  const [paintingFile, setPaintingFile] = useState<File | null>(null)

  const handleUpload = async (values: any) => {
    if (!paintingFile) return
    await onUpload({
      ownerId: userId,
      name: values.name,
      subject: values.subject,
      paintingFile,
    } as PaintingToAddType)
    setPaintingFile(null)
    form.resetFields()
  }

  return (
    <StyledModal
      title="Share Your Masterpiece"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            name="name"
            label="Painting Name"
            rules={[{ required: true, message: "Please input the painting name!" }]}
          >
            <Input style={{ borderRadius: 12, height: 40 }} />
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Please select a subject!" }]}>
            <Select style={{ borderRadius: 12 }}>
              {ESubject.map((subject, idx) => (
                <Select.Option key={idx} value={subject}>
                  {subject}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="paintingFile"
            label="Painting File"
            rules={[{ required: true, message: "Please upload a file!" }]}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".png,.jpg,.jpeg,.gif,.pdf,.mp3"
              onChange={(info) => {
                if (info.file.status === "removed") setPaintingFile(null)
                else if (info.file.originFileObj) setPaintingFile(info.file.originFileObj)
              }}
              fileList={paintingFile ? [{ uid: "-1", name: paintingFile.name, status: "done" }] : []}
            >
              <Button icon={<UploadOutlined />} style={{ borderRadius: 12, height: 40 }}>
                Select File
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <StyledButton
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
              disabled={!paintingFile}
            >
              {loading ? "Uploading..." : "Upload Masterpiece"}
            </StyledButton>
          </Form.Item>
        </Form>
      </motion.div>
    </StyledModal>
  )
}

export default PaintingUploadModal

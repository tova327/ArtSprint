import { Modal, Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ESubject } from "../store/paintingSlice";
import  { useState } from "react";
import { PaintingToAddType } from '../store/paintingSlice'; 
const PaintingUploadModal = ({
  visible,
  onCancel,
  onUpload,
  loading,
  userId,
  
}: any) => {
  const [form] = Form.useForm();
  const [paintingFile, setPaintingFile] = useState<File | null>(null);

  const handleUpload = async (values: any) => {
    if (!paintingFile) return;
    await onUpload({
      ownerId: userId,
      name: values.name,
      subject: values.subject,
      paintingFile,
    } as PaintingToAddType);
    setPaintingFile(null);
    form.resetFields();
  };

  return (
    <Modal title="Upload Your Painting" open={visible} onCancel={onCancel} footer={null} destroyOnClose centered>
      <Form form={form} layout="vertical" onFinish={handleUpload}>
        <Form.Item name="name" label="Painting Name" rules={[{ required: true, message: 'Please input the painting name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Please select a subject!' }]}>
          <Select>
            {ESubject.map((subject, idx) => (
              <Select.Option key={idx} value={subject}>{subject}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="paintingFile" label="Painting File" rules={[{ required: true, message: 'Please upload a file!' }]}>
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            accept=".png,.jpg,.jpeg,.gif,.pdf,.mp3"
            onChange={info => {
              if (info.file.status === "removed") setPaintingFile(null);
              else if (info.file.originFileObj) setPaintingFile(info.file.originFileObj);
            }}
            fileList={paintingFile ? [{ uid: "-1", name: paintingFile.name, status: "done" }] : []}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} disabled={!paintingFile}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaintingUploadModal;
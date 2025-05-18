import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Modal, Form, Input, Upload, Select, message, Spin, notification } from 'antd';
import { AppDispatch, StoreType } from '../store/store';
import { ESubject, fetchPaintingsAsync, PaintingType, uploadPaintingAsync } from '../store/paintingSlice';
import ShowPainting from './ShowPainting';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import PopularPaintings from './PopularPaintings';
import LatestPaintings from './LatestPaintings';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 32px 6vw 0 6vw;
  display: flex;
  flex-direction: column;
  @media (max-width: 900px) {
    padding: 24px 2vw 0 2vw;
  }
  @media (max-width: 600px) {
    padding: 12px 0 0 0;
  }
`;

const UploadButton = styled(Button)`
  border-radius: ${({ theme }:{theme:any}) => theme.borderRadius};
  border: 2px solid ${({ theme }:{theme:any}) => theme.primary};
  background: #fff;
  color: ${({ theme }:{theme:any}) => theme.primary};
  font-weight: 600;
  margin-bottom: 24px;
  &:hover {
    background: ${({ theme }:{theme:any}) => theme.primary};
    color: #fff;
    border-color: ${({ theme }:{theme:any}) => theme.primary};
  }
`;

const PaintingsPage: React.FC = () => {
  // ✅ All hooks at the top
  const dispatch = useDispatch<AppDispatch>();
  const paintings = useSelector((store: StoreType) => store.painting.paintings);
  const token = useSelector((store: StoreType) => store.user.token);
  const userId = useSelector((store: StoreType) => store.user.user.id);
  const loading = useSelector((store: StoreType) => store.painting.loading);
  const error = useSelector((store: StoreType) => store.painting.error);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [acceptedFileTypes, setAcceptedFileTypes] = useState<string[]>([]);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const subjectFilter = query.get('subject');

  useEffect(() => {
    dispatch(fetchPaintingsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error,
        duration: 4,
      });
    }
  }, [error]);

  const handleUpload = async (values: any) => {
    const paintingData = {
      ownerId: userId,
      name: values.name,
      subject: values.subject,
      paintingFile: values.paintingFile[0].originFileObj
    };
    const resultAction = await dispatch(uploadPaintingAsync({ painting: paintingData, token: token || "" }));
    if (uploadPaintingAsync.fulfilled.match(resultAction)) {
      message.success('Painting uploaded successfully!');
      setIsModalVisible(false);
      form.resetFields();
    } else {
      message.error('Failed to upload painting');
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleSubjectChange = (value: number) => {
    const valueSwitch = ESubject[value];
    switch (valueSwitch) {
      case 'Music':
        setAcceptedFileTypes(['.mp3']);
        break;
      case 'Photography':
      case 'Drawing':
      case 'Graphic':
        setAcceptedFileTypes(['.png', '.jpg', '.jpeg', '.gif']);
        break;
      case 'Writing':
        setAcceptedFileTypes(['.pdf']);
        break;
      default:
        setAcceptedFileTypes([]);
    }
  };

  const subjectOptions = ESubject.map((subject, index) => (
    <Select.Option key={index} value={index}>{subject}</Select.Option>
  ));

  // ✅ Only return after all hooks are declared!
  return (
    <PageContainer>
      {loading && (
        <div style={{
          position: 'fixed', zIndex: 9999, top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Spin size="large" tip="Loading..." />
        </div>
      )}
      <h1 style={{
        textAlign: 'center',
        marginBottom: '32px',
        fontWeight: 800,
        fontSize: '2.4rem',
        letterSpacing: '2px',
        color: '#222',
        textShadow: '0 2px 6px #eee'
      }}>Paintings</h1>
      <PopularPaintings />
      <UploadButton type="default" onClick={showModal}>Upload New Painting</UploadButton>
      <Modal
        title="Upload New Painting"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpload} layout="vertical">
          <Form.Item
            name="name"
            label="Painting Name"
            rules={[{ required: true, message: 'Please input the painting name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please select a subject!' }]}
          >
            <Select onChange={handleSubjectChange}>
              {subjectOptions}
            </Select>
          </Form.Item>
          <Form.Item
            name="paintingFile"
            label="Painting File"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: 'Please upload a file!' }]}
          >
            <Upload
              beforeUpload={() => false}
              accept={acceptedFileTypes.join(',')}
              maxCount={1}
            >
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Upload</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[28, 28]} style={{ marginTop: 8 }}>
        {paintings
          .filter((p: PaintingType) => !subjectFilter || ESubject[p.subject] === subjectFilter)
          .map((painting: PaintingType) => (
            <Col xs={24} sm={12} md={8} lg={6} key={painting.id}>
              <ShowPainting painting={painting} />
            </Col>
          ))}
      </Row>
      <LatestPaintings />
    </PageContainer>
  );
};

export default PaintingsPage;
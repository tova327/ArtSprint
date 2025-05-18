import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Modal, Form, Input, Upload, Select, message, Spin } from 'antd';
import { AppDispatch, StoreType } from '../store/store';
import { ESubject, fetchPaintingsAsync, PaintingType, uploadPaintingAsync } from '../store/paintingSlice';
import ShowPainting from './ShowPainting';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 32px 10vw;
  background: #f8fafc;
  min-height: 100vh;
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
    const dispatch = useDispatch<AppDispatch>();
    const paintings = useSelector((store: StoreType) => store.painting.paintings);
    const token = useSelector((store: StoreType) => store.user.token);
    const userId = useSelector((store: StoreType) => store.user.user.id);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [acceptedFileTypes, setAcceptedFileTypes] = useState<string[]>([]);
    
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const subjectFilter = query.get('subject');

    useEffect(() => {
        const loadPaintings = async () => {
            await dispatch(fetchPaintingsAsync());
            setLoading(false);
        };
        loadPaintings();
    }, [dispatch]);

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

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
    }

    return (
        <PageContainer>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '32px',
                fontWeight: 800,
                fontSize: '2.4rem',
                letterSpacing: '2px',
                color: '#222',
                textShadow: '0 2px 6px #eee'
            }}>Paintings</h1>
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
        </PageContainer>
    );
};

export default PaintingsPage;
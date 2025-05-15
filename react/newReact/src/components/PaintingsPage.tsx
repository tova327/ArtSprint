import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Modal, Form, Input, Upload, Select, message } from 'antd';
import { AppDispatch, StoreType } from '../store/store';
import { ESubject, fetchPaintingsAsync, PaintingType, uploadPaintingAsync } from '../store/paintingSlice';
import ShowPainting from './ShowPainting';
import { useLocation } from 'react-router-dom';

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
    
    // Parse query parameters
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
        console.log("submit upload file " + token);
        
        const resultAction = await dispatch(uploadPaintingAsync({ painting: paintingData, token: token || "" }));
        if (uploadPaintingAsync.fulfilled.match(resultAction)) {
            message.success('Painting uploaded successfully!');
            setIsModalVisible(false);
            form.resetFields();
        } else {
            message.error('Failed to upload painting');
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubjectChange = (value: number) => {
        // Update accepted file types based on the selected subject
        const valueSwitch=ESubject[value]
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
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Paintings</h1>
            <Button type="primary" onClick={showModal} style={{ marginBottom: '20px' }}>Upload New Painting</Button>
            <Row gutter={[16, 16]}>
                {paintings.map((painting: PaintingType) => {
                    const isSubjectMatched = ESubject[painting.subject] === subjectFilter || !subjectFilter;
                    return isSubjectMatched && (
                        <Col key={painting.id} xs={24} sm={12} md={8} lg={6}>
                            <ShowPainting painting={painting} />
                        </Col>
                    );
                })}
            </Row>

            <Modal title="Upload Painting" open={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form form={form} onFinish={handleUpload}>
                    <Form.Item name="name" label="Painting Name" rules={[{ required: true, message: 'Please input the painting name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Please select a subject!' }]}>
                        <Select onChange={handleSubjectChange}>
                            {subjectOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item name="paintingFile" label="Upload Painting" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}>
                        <Upload beforeUpload={() => false} accept={acceptedFileTypes.join(', ')}>
                            <Button>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PaintingsPage;

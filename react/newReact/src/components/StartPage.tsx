
// src/components/StartPage.js
import { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { LoginAsync, UserLoginType } from '../store/userSlice'; // Adjust the import path as necessary
import { AppDispatch } from '../store/store';

const StartPage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = (values: { username: string; password: string }) => {
        const user: UserLoginType = { username: values.username, password: values.password };
        dispatch(LoginAsync({user})); // Call the LoginAsync function with the input values
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div >
            <h1 >Welcome to ArtSprint</h1>
            <div >
                <Button type="primary" onClick={showModal} >
                    Sign In
                </Button>
                <Button type="default" >
                    Sign Up
                </Button>
            </div>
            <Modal
                title="Sign In"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleOk}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};



export default StartPage;

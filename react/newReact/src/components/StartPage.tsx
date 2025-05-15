import { useState } from 'react';
import { Button, Modal, Form, Input, DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { LoginAsync, RegisterAsync, UserLoginType, UserToAddType } from '../store/userSlice'; // Adjust the import path as necessary
import { AppDispatch } from '../store/store';

const StartPage = ({ toClose }: { toClose: Function }) => {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState<boolean>(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    //const error = useSelector((store: StoreType) => store.user.error)
    const showLoginModal = () => {
        setIsLoginModalVisible(true);
    };

    const showRegisterModal = () => {
        setIsRegisterModalVisible(true);
    };

    const handleLoginOk = async (values: { username: string; password: string }) => {
        const user: UserLoginType = { username: values.username, password: values.password };
        
        try {
            await dispatch(LoginAsync({ user }));
            setIsLoginModalVisible(false);
            toClose();
        } catch (error) {
            alert("Failed to login");
        }
    };
    

    const handleRegisterOk = async (values: UserToAddType) => {
        try {
            await dispatch(RegisterAsync({ user: values }));
            setIsRegisterModalVisible(false);
            toClose();
        } catch (error) {
            alert("Failed to register");
        }
    };

    const handleCancel = () => {
        setIsLoginModalVisible(false);
        setIsRegisterModalVisible(false);
    };

    return (
        <div>
            <h1>Welcome to ArtSprint</h1>
            <div>
                <Button type="primary" onClick={showLoginModal}>
                    Sign In
                </Button>
                <Button type="default" onClick={showRegisterModal}>
                    Sign Up
                </Button>
            </div>

            {/* Login Modal */}
            <Modal
                title="Sign In"
                open={isLoginModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleLoginOk}>
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

            {/* Register Modal */}
            <Modal
                title="Sign Up"
                open={isRegisterModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleRegisterOk}>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item
                        name="birthDate"
                        rules={[{ required: true, message: 'Please select your birth date!' }]}
                    >
                        <DatePicker placeholder="Birth Date" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StartPage;

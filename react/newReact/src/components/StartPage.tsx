import { useState } from 'react';
import { Button, Modal, Form, Input, DatePicker, Tooltip, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAsync, RegisterAsync, UserLoginType, UserToAddType } from '../store/userSlice';
import { AppDispatch, StoreType } from '../store/store';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import AnimatedBackground from './AnimatedBackground';

const Welcome = styled.h1`
  font-weight: 800;
  font-size: 2.2rem;
  color:rgb(249, 227, 234);
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
  text-shadow: 0 2px 8px rgb(255, 44, 177);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 38px;
`;

const Blurb = styled.p`
  text-align: center;
  color: #888;
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 1.1rem;
`;

const StartPage = ({ toClose }: { toClose: Function }) => {
    const [isLoginModalVisible, setIsLoginModalVisible] = useState<boolean>(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const userError = useSelector((store: StoreType) => store.user.error);

    // Helper: show notifications
    const openNotification = (type: 'success' | 'error', message: string, description: string) => {
        notification[type]({
            message,
            description,
            duration: 4
        });
    };

    // Show error from redux
    if (userError) {
        openNotification('error', "Action Failed", userError);
    }

    const showLoginModal = () => setIsLoginModalVisible(true);
    const showRegisterModal = () => setIsRegisterModalVisible(true);

    // Login handler with UX feedback
    const handleLoginOk = async (values: { username: string; password: string }) => {
        setLoginLoading(true);
        const user: UserLoginType = { username: values.username, password: values.password };
        try {
            const result = await dispatch(LoginAsync({ user })).unwrap();
            setIsLoginModalVisible(false);
            toClose();
            openNotification('success', "Welcome Back!", `Glad to see you again, ${result.name || values.username}!`);
        } catch (error: any) {
            openNotification('error', "Login Failed", error?.message || "Invalid username or password.");
        } finally {
            setLoginLoading(false);
        }
    };

    // Register handler with UX feedback
    const handleRegisterOk = async (values: UserToAddType) => {
        setRegisterLoading(true);
        try {
            await dispatch(RegisterAsync({ user: values })).unwrap();
            setIsRegisterModalVisible(false);
            toClose();
            openNotification('success', "Registration Successful", "Welcome to ArtSprint! You can now sign in.");
        } catch (error: any) {
            openNotification('error', "Registration Failed", error?.message || "Please try again.");
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleCancel = () => {
        setIsLoginModalVisible(false);
        setIsRegisterModalVisible(false);
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh", zIndex: 1 }}>
            <AnimatedBackground />
            <div style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: "32px 0",
            }}>
                <div>
                    <Welcome>
                        Welcome to ArtSprint
                        <Tooltip title="This is your creative community – join us!">
                            <InfoCircleOutlined style={{ marginLeft: 8, color: '#ff9800', fontSize: 22 }} />
                        </Tooltip>
                    </Welcome>
                    <Blurb>
                        Share, discover, and celebrate art in all its forms. Sign in or sign up to join the fun!
                    </Blurb>
                    <ButtonGroup>
                        <Button type="primary" size="large" onClick={showLoginModal} style={{ fontWeight: 600 }}>
                            Sign In
                        </Button>
                        <Button type="default" size="large" onClick={showRegisterModal} style={{ fontWeight: 600, color: "#ff4081", borderColor: "#ff4081" }}>
                            Sign Up
                        </Button>
                    </ButtonGroup>

                    {/* Login Modal */}
                    <Modal
                        title="Sign In"
                        open={isLoginModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        destroyOnClose
                        centered
                        afterClose={() => setLoginLoading(false)}
                    >
                        <Form layout="vertical" onFinish={handleLoginOk}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                                hasFeedback
                            >
                                <Input placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                                hasFeedback
                            >
                                <Input.Password
                                    placeholder="Password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loginLoading}
                                    disabled={loginLoading}
                                    style={{ width: '100%', fontWeight: 600 }}
                                >
                                    {loginLoading ? "Logging in..." : "Log In"}
                                </Button>
                            </Form.Item>
                            <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                                <span style={{ color: "#888" }}>
                                    New here?{" "}
                                    <Button type="link" onClick={() => { setIsLoginModalVisible(false); setIsRegisterModalVisible(true); }}>
                                        Create an account
                                    </Button>
                                </span>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Register Modal */}
                    <Modal
                        title="Sign Up"
                        open={isRegisterModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        destroyOnClose
                        centered
                        afterClose={() => setRegisterLoading(false)}
                    >
                        <Form layout="vertical" onFinish={handleRegisterOk}>
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                                hasFeedback
                            >
                                <Input placeholder="Your full name" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                                hasFeedback
                            >
                                <Input.Password
                                    placeholder="Password"
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
                                rules={[{ required: true, message: 'Please select your birth date!' }]}
                                hasFeedback
                            >
                                <DatePicker placeholder="Birth Date" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={registerLoading}
                                    disabled={registerLoading}
                                    style={{ width: '100%', fontWeight: 600 }}
                                >
                                    {registerLoading ? "Signing you up..." : "Sign Up"}
                                </Button>
                            </Form.Item>
                            <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                                <span style={{ color: "#888" }}>
                                    Already have an account?{" "}
                                    <Button type="link" onClick={() => { setIsRegisterModalVisible(false); setIsLoginModalVisible(true); }}>
                                        Sign in
                                    </Button>
                                </span>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default StartPage;
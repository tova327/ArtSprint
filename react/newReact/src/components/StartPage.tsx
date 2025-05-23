import { useState } from 'react';
import { Button, Tooltip, notification } from 'antd';
import styled from 'styled-components';
import AnimatedBackground from './AnimatedBackground';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import PaintingUploadModal from './PaintingUploadModal';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAsync, RegisterAsync, UserToAddType } from '../store/userSlice';
import { PaintingToAddType, uploadPaintingAsync } from '../store/paintingSlice';
import { AppDispatch, StoreType } from '../store/store';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

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
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((store: StoreType) => store.user.user);
  const token = useSelector((store: StoreType) => store.user.token);

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [mustUploadPainting, setMustUploadPainting] = useState(false);
  const [paintingUploadLoading, setPaintingUploadLoading] = useState(false);
  const [showPaintingModal, setShowPaintingModal] = useState(false);

  // Notification
  const openNotification = (type: 'success' | 'error', message: string, description: string) => {
    notification[type]({ message, description, duration: 4 });
  };

  // Login
  const handleLoginOk = async (values: { username: string; password: string }) => {
    setLoginLoading(true);
    try {
      const result = await dispatch(LoginAsync({ user: values })).unwrap();
      setIsLoginModalVisible(false);
      await checkUserPainting(user.id);
      openNotification('success', "Welcome Back!", `Glad to see you again, ${result.name || values.username}!`);
    } catch (error: any) {
      openNotification('error', "Login Failed", error?.message || "Invalid username or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Register
  const handleRegister = async (userDetails: UserToAddType) => {
    console.log('in handleRegister: '+userDetails);
    
    setRegisterLoading(true);
    try {
       await dispatch(RegisterAsync({ user: userDetails })).unwrap();
      setIsRegisterModalVisible(false);
      openNotification('success', "Registration Successful", "You can now upload your painting!");
      await checkUserPainting(user.id);
    } catch (err: any) {
      openNotification('error', "Register Failed", err?.message || "Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  // Check if user has painting
  const checkUserPainting = async (userid: string | number) => {
    try {
      const res = await axios.get(`https://artsprintserver.onrender.com/api/Painting/user/${userid}`);
      if (!res.data || res.data.length === 0) {
        setMustUploadPainting(true);
        setShowPaintingModal(true);
      } else {
        toClose();
      }
    } catch {
      openNotification('error', "Error", "Failed to check paintings");
    }
  };

  // Painting upload
  const handleUploadPainting = async (paintingData: PaintingToAddType) => {
    setPaintingUploadLoading(true);
    try {
      await dispatch(uploadPaintingAsync({ painting: paintingData, token:token ||""})).unwrap();
      openNotification('success', "Painting Uploaded", "Thank you for sharing your art!");
      setShowPaintingModal(false);
      setMustUploadPainting(false);
      toClose();
    } catch (err: any) {
      openNotification('error', "Upload Failed", err?.message || "Please try again.");
    } finally {
      setPaintingUploadLoading(false);
    }
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
            <Button type="primary" size="large" onClick={() => setIsLoginModalVisible(true)} style={{ fontWeight: 600 }}>
              Sign In
            </Button>
            <Button type="default" size="large" onClick={() => setIsRegisterModalVisible(true)} style={{ fontWeight: 600, color: "#ff4081", borderColor: "#ff4081" }}>
              Sign Up
            </Button>
          </ButtonGroup>

          <LoginModal
            open={isLoginModalVisible}
            onCancel={() => setIsLoginModalVisible(false)}
            onLogin={handleLoginOk}
            loading={loginLoading}
            switchToRegister={() => { setIsLoginModalVisible(false); setIsRegisterModalVisible(true); }}
          />

          <RegisterModal
            open={isRegisterModalVisible}
            onCancel={() => setIsRegisterModalVisible(false)}
            onRegister={handleRegister}
            loading={registerLoading}
          />

          <PaintingUploadModal
            visible={showPaintingModal}
            onCancel={() => setShowPaintingModal(false)}
            onUpload={handleUploadPainting}
            loading={paintingUploadLoading}
            userId={user?.id}
            token={token}
          />

          {mustUploadPainting &&
            <div style={{
              marginTop: 32,
              background: "#fff0f6",
              border: "1px solid #ff4081",
              borderRadius: 8,
              padding: 18,
              color: "#b71c50",
              fontWeight: 600,
              textAlign: "center",
              maxWidth: 400
            }}>
              <div>You must upload at least one painting to complete your profile.</div>
              <Button type="primary" onClick={() => setShowPaintingModal(true)} style={{ marginTop: 12 }}>
                Upload Painting
              </Button>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default StartPage;
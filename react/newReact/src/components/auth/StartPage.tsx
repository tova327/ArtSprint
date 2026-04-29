import {  useState } from "react";
import LoginModal from "./LoginModal";
import { notification } from "antd";
import { type UserToAddType } from "../../store/userSlice";
import ModalWrapper from "../common/AppModal";
import { AppAlert } from "../common/AppAlert";
import { useAuth } from "./AuthProvider";
import { RegisterModal } from "./RegisterModal";
import { Navigate, useLocation } from "react-router";
import useAlert from "../../Hooks/useAlert";
import AppSection from "../common/AppSection";
import { useSelector } from "react-redux";
import { StoreType } from "../../store/store";
import { navigate } from "@wix/dashboard-sdk/dist/types/sdk";

const StartPage = ({ toClose }: { toClose?: Function | null }) => {

  const [api, _] = notification.useNotification();
  const handleMassage = (type: 'success' | 'error' | 'warning', message: string, description: string) => {
    api[type]({
      message: message,
      description: description,
      duration: 4,
    });
  }

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const user = useSelector((state: StoreType) => state.user.user)
  // const [showPaintingModal, setShowPaintingModal] = useState(false);
  const location = useLocation()
  // const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string; isVisible?: boolean }>({ type: 'success', message: '', isVisible: false });
  const { login, register, isAuthenticated } = useAuth();
  // const handleOpenAlert = (type: 'success' | 'error' | 'warning', message: string) => {
  //   setAlert(prev => ({ ...prev, type, message, isVisible: true }));
  //   setTimeout(() => {
  //     setAlert(prev => ({ ...prev, isVisible: false }));
  //   }, 2000);
  // };

  const { alert, handleOpenAlert } = useAlert({ type: 'success', message: '', isVisible: false })
  const handleLoginOk = async (values: { username: string; password: string }) => {
    setLoginLoading(true)
    try {
      await login(values);
      setIsLoginModalVisible(false)
      console.log("user login " + user?.id);
      handleOpenAlert('success', `🎨 Welcome Back, ${user?.name || values.username}! Ready to create magic?`);
      const from = (location.state as any)?.from || "/"
      navigate(from)
    } catch (error: any) {
      handleOpenAlert('error', "Oops, we didn't recognize you. Please check your username and password and try again.");
    } finally {
      setLoginLoading(false);
      toClose && toClose();
    }
  };

  const handleRegister = async (userDetails: UserToAddType) => {
    setRegisterLoading(true);
    try {
      await register(userDetails);
      setIsRegisterModalVisible(false);
      handleOpenAlert('success', "🌟 Welcome to ArtSprint!");
       const from = (location.state as any)?.from || "/"
      navigate(from)
    } catch (err: any) {
      handleOpenAlert('error', err?.message || "Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <AppSection style={{ position: "relative", minHeight: "100vh", zIndex: 1 }}>
      <AppAlert type={alert.type} message={alert.message} isVisible={alert.isVisible} />

      {isAuthenticated ? <Navigate to="/" /> : <ModalWrapper title={"Welcome to ArtSprint"}
        actions={[{ label: "Login", onClick: () => setIsLoginModalVisible(true) },
        { label: "Register", onClick: () => setIsRegisterModalVisible(true) }]}
        visible={true}
        onClose={() => {
          handleMassage("error", "ooops:(", "We can't continue without logging in .");
        }} />}

      <LoginModal
        open={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onLogin={handleLoginOk}
        loading={loginLoading}
        switchToRegister={() => {
          setIsLoginModalVisible(false);
          setIsRegisterModalVisible(true);
        }}
      />


      <RegisterModal
        visible={isRegisterModalVisible}
        onClose={() => setIsRegisterModalVisible(false)}
        loading={registerLoading}
        onRegister={handleRegister}
      />

      {/* <PaintingUploadModal
        visible={showPaintingModal}
        onCancel={() => setShowPaintingModal(false)}
        userId={user?.id}

      /> */}
    </AppSection>
  );
};

export default StartPage;



// visible,
//   onCancel,
//   onUpload,
//   loading,
//   userId,

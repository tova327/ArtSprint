import {  useState } from "react";
import LoginModal from "./LoginModal";
import { notification } from "antd";
import { type UserToAddType } from "../../store/userSlice";
import ModalWrapper from "../common/AppModal";
import { AppAlert } from "../common/AppAlert";
import { useAuth } from "./AuthProvider";
import { RegisterModal } from "./RegisterModal";
import { Navigate } from "react-router";
import useAlert from "../../Hooks/useAlert";
import AppSection from "../common/AppSection";

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
  // const [showPaintingModal, setShowPaintingModal] = useState(false);
  
  // const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string; isVisible?: boolean }>({ type: 'success', message: '', isVisible: false });
  const { login, register,isAuthenticated } = useAuth();
  // const handleOpenAlert = (type: 'success' | 'error' | 'warning', message: string) => {
  //   setAlert(prev => ({ ...prev, type, message, isVisible: true }));
  //   setTimeout(() => {
  //     setAlert(prev => ({ ...prev, isVisible: false }));
  //   }, 2000);
  // };

const {alert, handleOpenAlert} = useAlert({type: 'success', message: '', isVisible: false})
  const handleLoginOk = async (values: { username: string; password: string }) => {
    setLoginLoading(true)
    try {
      const result = await login(values);
      setIsLoginModalVisible(false)
      console.log("before send to check painting " + result.user.id);

      handleOpenAlert('success', `🎨 Welcome Back, ${result.name || values.username}! Ready to create magic?`);

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
    } catch (err: any) {
      handleOpenAlert('error', err?.message || "Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <AppSection style={{ position: "relative", minHeight: "100vh", zIndex: 1 }}>
      <AppAlert type={alert.type} message={alert.message} isVisible={alert.isVisible} />

     {isAuthenticated?<Navigate to="/" />: <ModalWrapper title={"Welcome to ArtSprint"}
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

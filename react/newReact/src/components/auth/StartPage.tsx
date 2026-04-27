import { useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../store/store";
import LoginModal from "./LoginModal";
import { notification } from "antd";
import { type UserToAddType } from "../../store/userSlice";
import PaintingUploadModal from "../paintings/PaintingUploadModal";
import ModalWrapper from "../common/AppModal";
import { AppAlert } from "../common/AppAlert";
import { useAuth } from "./AuthProvider";
import { RegisterModal } from "./RegisterModal";

const StartPage = ({ toClose }: { toClose?: Function|null }) => {
  const user = useSelector((store: StoreType) => store.user.user);
  const [api, _] = notification.useNotification();
  const handleMassage = (type:'success' | 'error' | 'warning',message: string,description: string) => {
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
  const [showPaintingModal, setShowPaintingModal] = useState(false);
const[alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string; isVisible?: boolean }>({ type: 'success', message: '', isVisible: false });
const { login, register } = useAuth();
  const handleOpenAlert = (type: 'success' | 'error' | 'warning', message: string) => {
    setAlert(prev => ({ ...prev, type, message, isVisible: true }));
    setTimeout(() => {
      setAlert(prev => ({ ...prev, isVisible: false }));
    }, 2000);
  };


  const handleLoginOk = async (values: { username: string; password: string }) => {
    setLoginLoading(true)
    try {
      const result = await login(values);
      setIsLoginModalVisible(false)
      console.log("before send to check painting " + result.user.id);

      //await checkUserPainting(result.user.id)
      //handleMassage("success", "🎨 Welcome Back!", `Ready to create magic, ${result.name || values.username}?`);
      handleOpenAlert( 'success', `🎨 Welcome Back, ${result.name || values.username}! Ready to create magic?`);
      
    } catch (error: any) {
      //handleMassage("error", "❌ Login Failed", error?.message || "Invalid credentials.");
      handleOpenAlert('error',  "Oops, we didn't recognize you. Please check your username and password and try again.");
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
      //handleMassage("success", "🌟 Welcome to ArtSprint!", "Time to share your first masterpiece!");
      handleOpenAlert('success',"🌟 Welcome to ArtSprint!");
    } catch (err: any) {
      //handleMassage("error", "❌ Registration Failed", err?.message || "Please try again.");
      handleOpenAlert( 'error', err?.message || "Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", zIndex: 1 }}>
      <AppAlert type={alert.type} message={alert.message} isVisible={alert.isVisible} />

      <ModalWrapper title={"Welcome to ArtSprint"} actions={[{ label: "Login", onClick: () => setIsLoginModalVisible(true) }, { label: "Register", onClick: () => setIsRegisterModalVisible(true) }]} visible={true} onClose={() => {handleMassage("error", "ooops:(", "We can't continue without logging in .");}}/>

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

      <PaintingUploadModal
        visible={showPaintingModal}
        onCancel={() => setShowPaintingModal(false)}
        userId={user?.id}
        
      />
    </div>
  );
};

export default StartPage;



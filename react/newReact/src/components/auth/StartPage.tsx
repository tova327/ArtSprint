import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "../../store/store";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { notification } from "antd";
import { LoginAsync, RegisterAsync, type UserToAddType } from "../../store/userSlice";
import PaintingUploadModal from "../paintings/PaintingUploadModal";
import ModalWrapper from "../common/Modal";
import { AppAlert } from "../common/AppAlert";

const StartPage = ({ toClose }: { toClose: Function }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((store: StoreType) => store.user.user);
  const token = useSelector((store: StoreType) => store.user.token);
  const [api, _] = notification.useNotification();
  const handleMassage = (type:'success' | 'error' | 'warning',message: string,description: string) => {
    api[type]({
      message: message,
      description: description,
    });
  }
  
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPaintingModal, setShowPaintingModal] = useState(false);
const[alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string; isVisible: boolean }>({ type: 'success', message: '', isVisible: false });

  // const handleCloseAlert = () => {
  //   setAlert(prev => ({ ...prev, isVisible: false }));
  // };


  const handleLoginOk = async (values: { username: string; password: string }) => {
    setLoginLoading(true)
    try {
      const result = await dispatch(LoginAsync({ user: values })).unwrap()
      setIsLoginModalVisible(false)
      console.log("before send to check painting " + result.user.id);

      //await checkUserPainting(result.user.id)
      //handleMassage("success", "🎨 Welcome Back!", `Ready to create magic, ${result.name || values.username}?`);
      setAlert({ type: 'success', message: `🎨 Welcome Back, ${result.name || values.username}! Ready to create magic?`, isVisible: true });
    } catch (error: any) {
      //handleMassage("error", "❌ Login Failed", error?.message || "Invalid credentials.");
      setAlert({ type: 'error', message: error?.message || "Invalid credentials.", isVisible: true });
    } finally {
      setLoginLoading(false);
      toClose();
    }
  };

  const handleRegister = async (userDetails: UserToAddType) => {
    setRegisterLoading(true);
    try {
      await dispatch(RegisterAsync({ user: userDetails })).unwrap();
      setIsRegisterModalVisible(false);
      //handleMassage("success", "🌟 Welcome to ArtSprint!", "Time to share your first masterpiece!");
      setAlert({ type: 'success', message: "🌟 Welcome to ArtSprint!", isVisible: true });
    } catch (err: any) {
      //handleMassage("error", "❌ Registration Failed", err?.message || "Please try again.");
      setAlert({ type: 'error', message: err?.message || "Please try again.", isVisible: true });
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
        open={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        onRegister={handleRegister}
        loading={registerLoading}
      />

      <PaintingUploadModal
        visible={showPaintingModal}
        onCancel={() => setShowPaintingModal(false)}
        userId={user?.id}
        token={token}
      />
    </div>
  );
};

export default StartPage;



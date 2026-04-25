import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Title from "../common/Title";
import Button from "../common/Button";
import { AppDispatch, StoreType } from "../../store/store";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { notification } from "antd";
import { LoginAsync, RegisterAsync, type UserToAddType } from "../../store/userSlice";
import PaintingUploadModal from "../paintings/PaintingUploadModal";

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



  const handleLoginOk = async (values: { username: string; password: string }) => {
    setLoginLoading(true)
    try {
      const result = await dispatch(LoginAsync({ user: values })).unwrap()
      setIsLoginModalVisible(false)
      console.log("before send to check painting " + result.user.id);

      //await checkUserPainting(result.user.id)
      handleMassage("success", "🎨 Welcome Back!", `Ready to create magic, ${result.name || values.username}?`);

    } catch (error: any) {
      handleMassage("error", "❌ Login Failed", error?.message || "Invalid credentials.");
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
      handleMassage("success", "🌟 Welcome to ArtSprint!", "Time to share your first masterpiece!");
    } catch (err: any) {
      handleMassage("error", "❌ Registration Failed", err?.message || "Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", zIndex: 1 }}>
      <Title level={1}>Welcome to ArtSprint</Title>
      <Button type="primary" onClick={() => setIsLoginModalVisible(true)}>
        Login
      </Button>
      <Button type="default" onClick={() => setIsRegisterModalVisible(true)}>
        Register
      </Button>

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



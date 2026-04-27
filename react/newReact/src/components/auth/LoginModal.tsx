"use client"

import { motion } from "framer-motion"
import AppModal from "../common/AppModal"
import AppForm from "../common/AppForm"
import AppFormItem from "../common/AppFormItem"
import AppInput from "../common/AppInput"
import AppButton from "../common/AppButton"
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from "@ant-design/icons"
import { AppCaption } from "../common/AppText"

const LoginModal = ({
  open,
  onCancel,
  onLogin,
  loading,
  switchToRegister = () => {},
}: {
  open: boolean
  onCancel: () => void
  onLogin: (values: any) => Promise<void>
  loading: boolean
  switchToRegister: () => void
}) => {
  const description = (
    <div className="description-container">
      

      

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        

        <AppForm onFinish={(values) => onLogin(values)}>
          <AppFormItem
            name="username"
            label={
              <span>
                <UserOutlined /> Username
              </span>
            }
            rules={[{ required: true, message: "Please input your username!" }]}>
            <AppInput placeholder="Enter your username" />
          </AppFormItem>

          <AppFormItem
            name="password"
            label={
              <span>
                <LockOutlined /> Password
              </span>
            }
            rules={[{ required: true, message: "Please input your password!" }]}>
            <AppInput
              type="password"
              placeholder="Enter your password"
              iconRender={(visible:boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}Type 
            />
          </AppFormItem>

          <AppButton
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            style={{ width: "100%", marginBottom: 20 }}
          >
            {loading ? "Signing In..." : "Let's Start!"}
          </AppButton>
        </AppForm>

        <div>
          <AppCaption >New to our community? </AppCaption>
          <AppButton type="link" onClick={switchToRegister}>
            Sign Up Now
          </AppButton>
        </div>
      </motion.div>
    </div>
  );

  return (
    <AppModal
      title="Welcome Back!"
      description={description}
      actions={[]}
      visible={open}
      onClose={onCancel}
    />
  );
};

export default LoginModal

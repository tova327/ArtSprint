import { Modal, Form, Input, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const LoginModal = ({
  open,
  onCancel,
  onLogin,
  loading,
  switchToRegister,
}: {
  open: boolean,
  onCancel: () => void,
  onLogin: (values: { username: string, password: string }) => Promise<void>,
  loading: boolean,
  switchToRegister: () => void,
}) => (
  <Modal
    title="Sign In"
    open={open}
    onCancel={onCancel}
    footer={null}
    destroyOnClose
    centered
    afterClose={() => {}}
  >
    <Form layout="vertical" onFinish={onLogin}>
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
          loading={loading}
          disabled={loading}
          style={{ width: '100%', fontWeight: 600 }}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </Form.Item>
      <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
        <span style={{ color: "#888" }}>
          New here?{" "}
          <Button type="link" onClick={switchToRegister}>
            Create an account
          </Button>
        </span>
      </Form.Item>
    </Form>
  </Modal>
);

export default LoginModal;
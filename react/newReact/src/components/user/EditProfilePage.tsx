

import React, { useState } from "react";
import {
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import api from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";

import { StoreType } from "../../store/store";
import { setUser } from "../../store/userSlice";
import AppButton from "../common/AppButton";

const { Title } = Typography;

type FormType = {
  name: string;
  email: string;
  password: string;
  birthDate: dayjs.Dayjs;
};

export const EditProfilePage: React.FC = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: StoreType) => state.user.user);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<FormType>();

  if (!user) return null;

  const onFinish = async (values: FormType) => {
    try {
      setLoading(true);

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        birthDate: values.birthDate.toISOString(),
      };

      const res = await api.put(
        `/users/${user.id}`,
        payload
      );

      dispatch(setUser(res.data));

      message.success("Profile updated successfully");
    } catch (err) {
      console.error(err);

      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex justify="center" style={{ padding: 24 }}>
      <Card
        style={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 16,
        }}
      >
        <Title level={3}>Edit Profile</Title>

        <Form<FormType>
          form={form}
          layout="vertical"
          initialValues={{
            name: user.name,
            email: user.email,
            password: "",
            birthDate: dayjs(user.birthDate),
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter your name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Invalid email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                min: 4,
                message:
                  "Password must contain at least 4 characters",
              },
            ]}
          >
            <Input.Password
              placeholder="Leave empty to keep current password"
            />
          </Form.Item>

          <Form.Item
            label="Birth Date"
            name="birthDate"
            rules={[
              {
                required: true,
                message: "Please choose birth date",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
            />
          </Form.Item>

          <AppButton
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Save Changes
          </AppButton>
        </Form>
      </Card>
    </Flex>
  );
};

export default EditProfilePage;


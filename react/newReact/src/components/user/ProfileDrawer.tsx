import React, { useState, useEffect } from "react";
import { Drawer, Divider, Tag, Spin, Button } from "antd";
import { UserOutlined, CalendarOutlined, CrownOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "../../store/store";
import { updateUserAsync } from "../../store/userSlice";

import AppForm from "../common/AppForm";
import AppFormItem from "../common/AppFormItem";
import AppInput from "../common/AppInput";
import useAlert from "../../Hooks/useAlert";

const DrawerContent = styled.div`
  padding: 20px 0;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;

  .label {
    font-weight: 600;
    min-width: 100px;
    color: rgba(0, 0, 0, 0.65);
  }

  .value {
    color: rgba(0, 0, 0, 0.85);
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 16px 0;
  color: rgba(0, 0, 0, 0.85);
`;


interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: StoreType) => state.user.user);
  const loading = useSelector((state: StoreType) => state.user.loading);
    const { handleOpenAlert } = useAlert({ type: 'success', message: '', isVisible: false })

  const [form] = AppForm.useForm();
  const [passwordForm] = AppForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
      });
      passwordForm.resetFields();
    }
  }, [open, user, form, passwordForm]);

  const handleProfileSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        updateUserAsync({
          userId: user.id,
          userData: {
            name: values.name,
            email: values.email,
            birthDate: values.birthDate,
            password: values.password,
          },
        })
      );

      if (updateUserAsync.fulfilled.match(result)) {
        handleOpenAlert("success", "Profile updated successfully!");
        form.resetFields();
      } else {
        handleOpenAlert("error", "Failed to update profile");
      }
    } catch (error: any) {
      handleOpenAlert("error", error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        updateUserAsync({
          userId: user.id,
          userData: {
            name: user.name,
            email: user.email,
            password: values.newPassword,
            birthDate: user.birthDate,
          },
        })
      );

      if (updateUserAsync.fulfilled.match(result)) {
        handleOpenAlert("success", "Password changed successfully!");
        passwordForm.resetFields();
      } else {
        handleOpenAlert("error", "Failed to change password");
      }
    } catch (error: any) {
      handleOpenAlert("error", error.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAge = (_: any, value: string) => {
    if (!value) return Promise.reject("Birth date is required");

    const birth = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return Promise.reject("You must be at least 13 years old");
    }

    if (age > 120) {
      return Promise.reject("Please enter a valid birth date");
    }

    return Promise.resolve();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!user || user.id === 0) {
    return null;
  }

  return (
    <Drawer
      title="Profile Settings"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      bodyStyle={{ padding: 0 }}
    >
      <Spin spinning={loading}>
        <DrawerContent>
          {/* User Info Section */}
          <InfoSection style={{ padding: "0 24px" }}>
            <SectionTitle style={{ margin: "0 0 16px 0" }}>
              Account Information
            </SectionTitle>

            <InfoItem>
              <CrownOutlined style={{ color: "#ff8c42", fontSize: 16 }} />
              <span className="label">Role:</span>
              <Tag color={user.role === "admin" ? "red" : "blue"}>
                {user.role.toUpperCase()}
              </Tag>
            </InfoItem>

            <InfoItem>
              <CalendarOutlined style={{ color: "#ff8c42", fontSize: 16 }} />
              <span className="label">Member Since:</span>
              <span className="value">{formatDate(user.cameOn)}</span>
            </InfoItem>

            {user.lastPaint && (
              <InfoItem>
                <UserOutlined style={{ color: "#ff8c42", fontSize: 16 }} />
                <span className="label">Last Paint:</span>
                <span className="value">{formatDate(user.lastPaint)}</span>
              </InfoItem>
            )}
          </InfoSection>

          {/* Edit Profile Section */}
          <div style={{ padding: "0 24px" }}>
            <SectionTitle>Edit Profile</SectionTitle>
            <AppForm
              form={form}
              layout="vertical"
              onFinish={handleProfileSubmit}
            >
              <AppFormItem
                name="name"
                label="Name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <AppInput placeholder="Enter your name" />
              </AppFormItem>

              <AppFormItem
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <AppInput placeholder="Enter your email" />
              </AppFormItem>

              <AppFormItem
                name="birthDate"
                label="Birth Date"
                rules={[
                  { required: true, message: "Birth date is required" },
                  { validator: validateAge },
                ]}
              >
                <AppInput type="date" />
              </AppFormItem>

              <AppFormItem
                name="password"
                label="Current Password (for verification)"
                rules={[
                  { required: true, message: "Current password is required" },
                ]}
              >
                <AppInput
                  type="password"
                  placeholder="Enter your current password"
                />
              </AppFormItem>

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
                style={{ marginTop: 16 }}
              >
                Save Profile
              </Button>
            </AppForm>
          </div>

          <Divider />

          {/* Password Change Section */}
          <div style={{ padding: "0 24px" }}>
            <SectionTitle>Change Password</SectionTitle>
            <AppForm
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordSubmit}
            >
              <AppFormItem
                name="currentPassword"
                label="Current Password"
                rules={[
                  { required: true, message: "Current password is required" },
                ]}
              >
                <AppInput
                  type="password"
                  placeholder="Enter your current password"
                />
              </AppFormItem>

              <AppFormItem
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: "New password is required" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters",
                  },
                ]}
              >
                <AppInput
                  type="password"
                  placeholder="Enter your new password"
                />
              </AppFormItem>

              <AppFormItem
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <AppInput
                  type="password"
                  placeholder="Confirm your new password"
                />
              </AppFormItem>

              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={isSubmitting}
                block
                style={{ marginTop: 16 }}
              >
                Change Password
              </Button>
            </AppForm>
          </div>
        </DrawerContent>
      </Spin>
    </Drawer>
  );
};

export default ProfileDrawer;

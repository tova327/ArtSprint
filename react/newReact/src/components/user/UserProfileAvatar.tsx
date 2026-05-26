import React, { useState } from "react";
import { Dropdown, Space, Avatar } from "antd";
import { UserOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthProvider";
import ProfileDrawer from "./ProfileDrawer";

const AvatarButton = styled(motion.div)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarStyled = styled(Avatar)`
  background: linear-gradient(135deg, #ff8c42 0%, #ff6b6b 100%);
  border: 2px solid rgba(255, 107, 107, 0.3);
  font-weight: 600;
  font-size: 16px;

  &:hover {
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  }
`;

const UserProfileAvatar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!user || user.id === 0) {
    return null;
  }

  // Get user initials
  const getInitials = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  const handleEditProfile = () => {
    setIsDrawerOpen(true);
  };

  const menuItems = [
    {
      key: "profile",
      label: (
        <Space>
          <EditOutlined />
          <span>View & Edit Profile</span>
        </Space>
      ),
      onClick: handleEditProfile,
    },
    {
      key: "logout",
      label: (
        <Space>
          <LogoutOutlined />
          <span>Logout</span>
        </Space>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      <AvatarButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <AvatarStyled
            size={44}
            icon={<UserOutlined />}
          >
            {getInitials(user.name)}
          </AvatarStyled>
        </Dropdown>
      </AvatarButton>

      <ProfileDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default UserProfileAvatar;

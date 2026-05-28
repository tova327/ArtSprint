

import React, { useMemo } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  EditOutlined,
  LogoutOutlined,
  UserOutlined,
  CrownOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { StoreType } from "../../store/store";
import { useAuth } from "../auth/AuthProvider";

const { Text } = Typography;

export const UserAvatar: React.FC = () => {
  const navigate = useNavigate();

  const user = useSelector((state: StoreType) => state.user.user);

  const { isAuthenticated, logout } = useAuth();

  // -----------------------------------
  // USER INITIALS
  // -----------------------------------
  const initials = useMemo(() => {
    if (!user?.name) return "?";

    return user.name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  // -----------------------------------
  // NOT AUTHENTICATED
  // -----------------------------------
  if (!isAuthenticated || !user) {
    return (
      <Button
        type="primary"
        icon={<LoginOutlined />}
        onClick={() => navigate("/login")}
      >
        Login
      </Button>
    );
  }

  // -----------------------------------
  // MENU ITEMS
  // -----------------------------------
  const items: MenuProps["items"] = [
    {
      key: "profile-header",
      disabled: true,
      label: (
        <Flex vertical gap={4} style={{ minWidth: 220 }}>
          <Flex align="center" gap={8}>
            <Avatar size={48}>
              {initials}
            </Avatar>

            <Flex vertical>
              <Text strong>{user.name}</Text>

              <Text type="secondary" style={{ fontSize: 12 }}>
                {user.email}
              </Text>

              {user.role === "admin" && (
                <Tag
                  color="gold"
                  icon={<CrownOutlined />}
                  style={{ width: "fit-content", marginTop: 4 }}
                >
                  Admin
                </Tag>
              )}
            </Flex>
          </Flex>
        </Flex>
      ),
    },

    {
      type: "divider",
    },

    {
      key: "view-profile",
      icon: <UserOutlined />,
      label: "View Profile",
      onClick: () => navigate("/profile"),
    },

    {
      key: "edit-profile",
      icon: <EditOutlined />,
      label: "Edit Profile",
      onClick: () => navigate("/profile/edit"),
    },

    {
      type: "divider",
    },

    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  // -----------------------------------
  // COMPONENT
  // -----------------------------------
  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Space
        style={{
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Avatar
          size={40}
          style={{
            backgroundColor:
              user.role === "admin" ? "#faad14" : "#1677ff",
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>
      </Space>
    </Dropdown>
  );
};

export default UserAvatar;


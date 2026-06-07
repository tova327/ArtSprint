

import React from "react";
import {
  Avatar,
  Card,
  Divider,
  Flex,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CrownOutlined,
  TrophyOutlined,
  
} from "@ant-design/icons";
import { useSelector } from "react-redux";

import { StoreType } from "../../store/store";

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const user = useSelector((state: StoreType) => state.user.user);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Flex justify="center" style={{ padding: 24 }}>
      <Card
        style={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 16,
        }}
      >
        <Flex vertical align="center" gap={12}>
          <Avatar
            size={100}
            style={{
              fontSize: 36,
              backgroundColor:
                user.role === "admin" ? "#faad14" : "#1677ff",
            }}
          >
            {initials}
          </Avatar>

          <Title level={3} style={{ margin: 0 }}>
            {user.name}
          </Title>

          <Space>
            

            {user.role === "admin" ? (
              <Tag icon={<CrownOutlined />} color="gold">
                Admin
              </Tag>
            ):<Tag color="blue">{user.role}</Tag>}

            {user.isMedal && (
              <Tag icon={<TrophyOutlined />} color="purple">
                Medal User
              </Tag>
            )}
          </Space>
        </Flex>

        <Divider />

        <Flex vertical gap={16}>
          <ProfileRow label="Email" value={user.email} />

          <ProfileRow
            label="Birth Date"
            value={new Date(user.birthDate).toLocaleDateString()}
          />

          <ProfileRow
            label="Joined"
            value={new Date(user.cameOn).toLocaleDateString()}
          />

          <ProfileRow
            label="Last Paint"
            value={new Date(user.lastPaint).toLocaleDateString()}
          />
        </Flex>
      </Card>
    </Flex>
  );
};

type ProfileRowProps = {
  label: string;
  value: string;
};

const ProfileRow: React.FC<ProfileRowProps> = ({
  label,
  value,
}) => {
  return (
    <Flex justify="space-between" align="center">
      <Text strong>{label}</Text>

      <Text type="secondary">{value}</Text>
    </Flex>
  );
};

export default ProfilePage;


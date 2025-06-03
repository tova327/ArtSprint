"use client"

import { getAllUsersAsync, type UserType } from "../store/userSlice"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { CalendarOutlined, MailOutlined, CrownOutlined } from "@ant-design/icons"

const UserCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 25px;
  margin: 20px 0;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(76, 201, 196, 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(76,201,196,0.2), transparent);
    transition: left 0.8s;
  }
  
  &:hover::before {
    left: 100%;
  }
`

const UserAvatar = styled(motion.div)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: 900;
  margin-right: 20px;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.8);
  position: relative;
  
  &::after {
    content: '✨';
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 16px;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

const UserName = styled(motion.h3)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: 1.8rem;
  margin: 0;
`

const UserRole = styled(motion.p)`
  margin: 5px 0 0 0;
  color: #666;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  margin: 12px 0;
  font-weight: 600;
  font-size: 1rem;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(76, 201, 196, 0.2);
`

const MedalBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  margin-top: 10px;
`

const UserDetails = ({ id, short }: { id: number; short: boolean }) => {
  const dispatch = useDispatch<AppDispatch>()
  const allUsers = useSelector((store: StoreType) => store.user.allusers)
  const token = useSelector((store: StoreType) => store.user.token)

  const [user, setUser] = useState<UserType | undefined>(undefined)

  useEffect(() => {
    dispatch(getAllUsersAsync({ token: token || "" }))
  }, [dispatch, token])

  useEffect(() => {
    const u = allUsers?.find((u) => u.id === id)
    setUser(u)
  }, [allUsers, id])

  const formatCameOnDate = (date: any) => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleDateString() : "N/A"
  }

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (short) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(76,201,196,0.10)",
          borderRadius: "14px",
          padding: "2px 10px 2px 6px",
          fontSize: "0.98rem",
          fontWeight: 500,
          color: "#3b444b",
          border: "1px solid rgba(76,201,196,0.12)",
          boxShadow: "0 1px 4px rgba(76,201,196,0.06)",
          maxWidth: 170,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span
          style={{
            width: 23,
            height: 23,
            borderRadius: "50%",
            background: "linear-gradient(120deg, #f6d365, #fda085)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.5,
            marginRight: 1,
          }}
        >
          {user?.name ? getInitials(user.name) : "?"}
        </span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 110,
            display: "inline-block",
            verticalAlign: "middle",
          }}
          title={user?.name || "Unknown"}
        >
          {user?.name || "Unknown"}
        </span>
      </span>
    );
  }

  return (
    <UserCard
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <UserInfo>
        <UserAvatar
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          {user?.name ? getInitials(user.name) : "🎨"}
        </UserAvatar>
        <div>
          <UserName
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {user?.name || "Mystery Artist"}
          </UserName>
          <UserRole initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            🎨 <span>Master Creator</span>
          </UserRole>
        </div>
      </UserInfo>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <InfoItem
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.02, x: 5 }}
        >
          <MailOutlined style={{ color: "#ff6b6b", fontSize: 18 }} />
          <span>{user?.email || "Email not available"}</span>
        </InfoItem>

        <InfoItem
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.02, x: 5 }}
        >
          <CalendarOutlined style={{ color: "#4ecdc4", fontSize: 18 }} />
          <span>Joined: {user?.cameOn ? formatCameOnDate(user.cameOn) : "Date not available"}</span>
        </InfoItem>

        {user?.isMedal && (
          <MedalBadge
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <CrownOutlined />
            <span>🏅 Medal Winner - Elite Artist</span>
          </MedalBadge>
        )}
      </motion.div>
    </UserCard>
  )
}

export default UserDetails

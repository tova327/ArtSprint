"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, message, Tooltip } from "antd"
import { ArrowRightOutlined, LikeOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { addLikeAsync, addLikeR } from "../store/paintingSlice"
import type { AppDispatch, StoreType } from "../store/store"
import { type PaintingType, ESubject } from "../store/paintingSlice"
import styled from "styled-components"
import { motion } from "framer-motion"
import { notification, Button as AntButton } from "antd"
import UserDetails from "./UserDetails"

const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(60, 60, 170, 0.15);
  margin: 20px 0;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(45deg, #ff4081, #ff9800, #56c6ff);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(255, 64, 129, 0.25);
  }
`

const PaintingImg = styled(motion.img)`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

const PaintingTitle = styled(motion.h2)`
  background: linear-gradient(45deg, #ff4081, #ff9800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 8px;
`

const ActionButton = styled(motion(Button))`
  border-radius: 12px;
  font-weight: 700;
  height: 40px;
  flex: 1;
  
  &.like-btn {
    background: linear-gradient(135deg, #ff4081, #ff9800);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.3);
  }
  
  &.view-btn {
    background: rgba(255, 255, 255, 0.2);
    color: #ff4081;
    border: 2px solid #ff4081;
  }
`

const ShowPainting = ({ painting }: { painting: PaintingType }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const [sessionLikes, setSessionLikes] = useState(0)
  const token = useSelector((store: StoreType) => store.user.token)

  const handleNavigate = () => {
    sessionStorage.setItem("lastPaintingCaller", location.pathname + location.search)
    navigate(`/painting/${painting.id}`)
  }

  const handleLike = async () => {
    if (!token) {
      message.warning("You must be logged in to like a painting.")
      return
    }
    if (sessionLikes >= 10) {
      message.warning("You cannot add more than 10 likes to this painting in this session.")
      return
    }

    let addLike = true
    notification.success({
      message: "Liked!",
      btn: (
        <AntButton size="small" onClick={() => (addLike = false)}>
          Undo
        </AntButton>
      ),
      duration: 3,
    })

    if (addLike) {
      dispatch(addLikeR(painting.id))
      setSessionLikes((prevLikes) => prevLikes + 1)
      try {
        await dispatch(addLikeAsync({ id: painting.id, count: 1, token })).unwrap()
        message.success("You liked this painting!")
      } catch (error) {
        dispatch(addLikeR(painting.id))
        setSessionLikes((prevLikes) => prevLikes - 1)
        message.error("Failed to like the painting. Please try again.")
      }
    }
  }

  const renderContent = () => {
    const subject = ESubject[painting.subject]
    switch (subject) {
      case "Music":
        return (
          <motion.audio
            controls
            style={{ width: "100%", borderRadius: 12 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <source src={painting.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </motion.audio>
        )
      case "Drawing":
      case "Photography":
      case "Graphic":
        return (
          <PaintingImg
            src={painting.url}
            alt={painting.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          />
        )
      case "Writing":
        return (
          <motion.div
            style={{
              background: "linear-gradient(135deg, rgba(255,64,129,0.1), rgba(255,152,0,0.1))",
              color: "#333",
              borderRadius: 12,
              padding: 16,
              fontFamily: "Inter, sans-serif",
              maxHeight: 200,
              overflow: "auto",
              border: "1px solid rgba(255,64,129,0.2)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {painting.name} from {painting.ownerId}
          </motion.div>
        )
      default:
        return <p>Unsupported painting type.</p>
    }
  }

  return (
    <GlassCard
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      whileHover={{ scale: 1.02 }}
    >
      <PaintingTitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        {painting.name}
      </PaintingTitle>

      <UserDetails id={painting.ownerId} short={true} />

      <motion.p
        style={{ margin: "8px 0", color: "#666", fontWeight: 600 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        ❤️ {painting.likes} likes
      </motion.p>

      <motion.div
        style={{ margin: "18px 0" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {renderContent()}
      </motion.div>

      <motion.div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 16,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Tooltip title="Like this painting">
          <ActionButton
            className="like-btn"
            icon={<LikeOutlined />}
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Like
          </ActionButton>
        </Tooltip>

        <Tooltip title="View details">
          <ActionButton
            className="view-btn"
            icon={<ArrowRightOutlined />}
            onClick={handleNavigate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View
          </ActionButton>
        </Tooltip>
      </motion.div>
    </GlassCard>
  )
}

export default ShowPainting

"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, message, Tooltip } from "antd"
import { LikeOutlined, EyeOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { addLikeAsync, addLikeR } from "../store/paintingSlice"
import type { AppDispatch, StoreType } from "../store/store"
import { type PaintingType, ESubject } from "../store/paintingSlice"
import styled from "styled-components"
import { motion } from "framer-motion"
import { notification, Button as AntButton } from "antd"
import UserDetails from "./UserDetails"

const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(25px);
  border-radius: 25px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 25px;
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 25px;
    padding: 3px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.8s;
  }

  &:hover::after {
    left: 100%;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 25px 70px rgba(255, 107, 107, 0.3);
  }
`

const PaintingImg = styled(motion.img)`
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(255, 107, 107, 0.2);
  transition: all 0.4s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  }
`

const PaintingTitle = styled(motion.h2)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: 1.6rem;
  margin-bottom: 12px;
  text-align: center;
`

const LikesDisplay = styled(motion.p)`
  margin: 12px 0;
  color: #666;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const ActionButton = styled(motion(Button))`
  border-radius: 15px;
  font-weight: 800;
  height: 45px;
  flex: 1;
  font-size: 15px;
  position: relative;
  overflow: hidden;
  
  &.like-btn {
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    border: none;
    color: white;
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }
  
  &.view-btn {
    background: linear-gradient(135deg, #4ecdc4, #45b7d1);
    border: none;
    color: white;
    box-shadow: 0 6px 20px rgba(76, 201, 196, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.6);
  }
`

const AudioPlayer = styled(motion.audio)`
  width: 100%;
  border-radius: 15px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 10px;
  
  &::-webkit-media-controls-panel {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 10px;
  }
`

const WritingPreview = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(76,201,196,0.1));
  color: #333;
  border-radius: 15px;
  padding: 20px;
  font-family: 'Georgia', serif;
  max-height: 200px;
  overflow: auto;
  border: 2px solid rgba(255, 107, 107, 0.3);
  position: relative;
  
  &::before {
    content: '📝';
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 1.5rem;
    opacity: 0.7;
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
      message.warning({
        content: "🔐 Please log in to like paintings!",
        style: { borderRadius: 15 },
      })
      return
    }
    if (sessionLikes >= 10) {
      message.warning({
        content: "💝 You've shown enough love for now!",
        style: { borderRadius: 15 },
      })
      return
    }

    let addLike = true
    notification.success({
      message: "💖 Liked!",
      description: "You've shown love for this masterpiece!",
      btn: (
        <AntButton size="small" onClick={() => (addLike = false)}>
          Undo
        </AntButton>
      ),
      duration: 3,
      style: { borderRadius: 15 },
    })

    if (addLike) {
      dispatch(addLikeR(painting.id))
      setSessionLikes((prevLikes) => prevLikes + 1)
      try {
        await dispatch(addLikeAsync({ id: painting.id, count: 1, token })).unwrap()
        message.success({
          content: "🎉 Love sent successfully!",
          style: { borderRadius: 15 },
        })
      } catch (error) {
        dispatch(addLikeR(painting.id))
        setSessionLikes((prevLikes) => prevLikes - 1)
        message.error({
          content: "💔 Failed to send love. Try again!",
          style: { borderRadius: 15 },
        })
      }
    }
  }

  const renderContent = () => {
    const subject = ESubject[painting.subject]
    switch (subject) {
      case "Music":
        return (
          <AudioPlayer
            controls
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <source src={painting.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </AudioPlayer>
        )
      case "Drawing":
      case "Photography":
      case "Graphic":
        return (
          <PaintingImg
            src={painting.url}
            alt={painting.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.03 }}
          />
        )
      case "Writing":
        return (
          <WritingPreview initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <strong>{painting.name}</strong> by Artist #{painting.ownerId}
            <br />
            <em>Click to read the full piece...</em>
          </WritingPreview>
        )
      default:
        return <p>🎨 Unsupported art type</p>
    }
  }

  return (
    <GlassCard
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      whileHover={{ scale: 1.02 }}
    >
      <PaintingTitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        {painting.name}
      </PaintingTitle>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <UserDetails id={painting.ownerId} short={true} />
      </motion.div>

      <LikesDisplay
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          ❤️
        </motion.span>
        <span>{painting.likes} loves</span>
      </LikesDisplay>

      <motion.div
        style={{ margin: "20px 0" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {renderContent()}
      </motion.div>

      <motion.div
        style={{
          display: "flex",
          gap: 15,
          marginTop: 20,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Tooltip title="Show some love! 💖">
          <ActionButton
            className="like-btn"
            icon={<LikeOutlined />}
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Love It
          </ActionButton>
        </Tooltip>

        <Tooltip title="Explore this masterpiece 🔍">
          <ActionButton
            className="view-btn"
            icon={<EyeOutlined />}
            onClick={handleNavigate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore
          </ActionButton>
        </Tooltip>
      </motion.div>
    </GlassCard>
  )
}

export default ShowPainting

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Spin, Button, List, Input, message } from "antd"
import type { PaintingType } from "../store/paintingSlice"
import type { CommentPostModel } from "../store/commentSlice"
import { useDispatch, useSelector } from "react-redux"
import { fetchCommentsAsync, addCommentAsync } from "../store/commentSlice"
import type { AppDispatch, StoreType } from "../store/store"
import { ESubject } from "../store/paintingSlice"
import TextFileDisplay from "./TextFileDisplay"
import styled from "styled-components"
import { motion } from "framer-motion"
import UserDetails from "./UserDetails"
import { ArrowLeftOutlined, SendOutlined, MessageOutlined } from "@ant-design/icons"

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 40px 6vw;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 20px 4vw;
  }
`

const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(25px);
  border-radius: 30px;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.15);
  margin: 40px 0;
  padding: 40px;
  border: 3px solid rgba(255, 107, 107, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 107, 107, 0.05), rgba(76, 201, 196, 0.05));
    pointer-events: none;
  }
`

const PaintingTitle = styled(motion.h2)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: 3rem;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '🎨';
    position: absolute;
    top: -10px;
    right: -50px;
    font-size: 2rem;
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`

const PaintingImg = styled(motion.img)`
  width: 100%;
  max-height: 600px;
  object-fit: cover;
  border-radius: 25px;
  margin: 30px 0;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  border: 4px solid rgba(255, 107, 107, 0.3);
  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.02);
  }
`

const BackButton = styled(motion(Button))`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  font-weight: 800;
  height: 55px;
  border-radius: 27px;
  padding: 0 30px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  font-size: 16px;
  
  &:hover {
    background: linear-gradient(135deg, #764ba2, #667eea);
    color: white;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
  }
`

const CommentSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 30px;
  margin-top: 40px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(76, 201, 196, 0.3);
`

const CommentForm = styled(motion.div)`
  display: flex;
  gap: 15px;
  margin-top: 25px;
  align-items: flex-end;
`

const SendButton = styled(motion(Button))`
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  font-weight: 800;
  height: 50px;
  border-radius: 15px;
  padding: 0 25px;
  
  &:hover {
    background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
    color: white;
    transform: translateY(-2px) scale(1.05);
  }
`

const LoadingContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  flex-direction: column;
`

const AudioPlayer = styled(motion.audio)`
  width: 100%;
  border-radius: 15px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 15px;
  margin: 20px 0;
`

const CommentItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  margin: 12px 0;
  padding: 18px 20px;
  border: 2px solid rgba(76, 201, 196, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '💬';
    position: absolute;
    top: 10px;
    right: 15px;
    opacity: 0.6;
  }
`

const PaintingComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [painting, setPainting] = useState<PaintingType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState<string>("")

  const comments = useSelector((store: StoreType) => store.comments.comments)
  const token = useSelector((store:StoreType) => store.user.token)
  const userId = useSelector((store: StoreType) => store.user.user.id)

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_MY_API_URL}Painting/${id}`)
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        setPainting(data)
        dispatch(fetchCommentsAsync())
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPainting()
  }, [id, dispatch])

  const handleBack = () => {
    const backUrl = sessionStorage.getItem("lastPaintingCaller") || "/"
    sessionStorage.removeItem("lastPaintingCaller")
    navigate(backUrl)
  }

  const handleAddComment = async () => {
    if (!commentContent) {
      message.error({
        content: "💭 Please write something beautiful!",
        style: { borderRadius: 15 },
      })
      return
    }
    const newComment: CommentPostModel = {
      content: commentContent,
      userId: userId,
      paintId: Number(id),
    }
    const resultAction = await dispatch(addCommentAsync({ comment: newComment,token: token||'' }))
    if (addCommentAsync.fulfilled.match(resultAction)) {
      message.success({
        content: "🎉 Your thoughts have been shared!",
        style: { borderRadius: 15 },
      })
      setCommentContent("")
    } else {
      message.error({
        content: "💔 Failed to share your thoughts",
        style: { borderRadius: 15 },
      })
    }
  }

  const renderContent = () => {
    if (!painting) return null
    const subject = ESubject[painting.subject]
    switch (subject) {
      case "Music":
        return (
          <AudioPlayer
            controls
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
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
            transition={{ duration: 1 }}
          />
        )
      case "Writing":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <TextFileDisplay fileUrl={painting.url} />
          </motion.div>
        )
      default:
        return <p>🎨 Unsupported art type</p>
    }
  }

  if (loading) {
    return (
      <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <LoadingContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ marginBottom: 20 }}
          >
            <Spin size="large" />
          </motion.div>
          <motion.h2
            style={{ color: "white", fontSize: "2.5rem", fontWeight: 900, marginBottom: 10 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            🎨 Loading Masterpiece...
          </motion.h2>
          <motion.p
            style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.3rem" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Preparing something beautiful ✨
          </motion.p>
        </LoadingContainer>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <GlassCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", color: "#ff6b6b" }}
        >
          <h2>💔 Oops! {error}</h2>
        </GlassCard>
      </PageContainer>
    )
  }

  if (!painting) {
    return (
      <PageContainer>
        <GlassCard initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
          <h2>🔍 Masterpiece not found</h2>
        </GlassCard>
      </PageContainer>
    )
  }

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <GlassCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <BackButton
          onClick={handleBack}
          icon={<ArrowLeftOutlined />}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏠 Back to Gallery
        </BackButton>

        <PaintingTitle
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          {painting.name}
        </PaintingTitle>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <UserDetails id={painting.ownerId} short={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {renderContent()}
        </motion.div>

        <CommentSection
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.h3
            style={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "1.8rem",
              fontWeight: 900,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <MessageOutlined /> 💬 Share Your Thoughts
          </motion.h3>

          <List
            dataSource={comments.filter((c) => c.paintId === painting.id)}
            renderItem={(item, index) => (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 1.4, duration: 0.6 }}
              >
                <CommentItem>{item.content}</CommentItem>
              </motion.div>
            )}
            style={{ marginBottom: 25 }}
          />

          <CommentForm
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <Input
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="✨ Share what this masterpiece makes you feel..."
              style={{
                borderRadius: 15,
                height: 50,
                border: "3px solid rgba(76, 201, 196, 0.3)",
                fontSize: 16,
                background: "rgba(255, 255, 255, 0.9)",
              }}
              onPressEnter={handleAddComment}
            />
            <SendButton
              onClick={handleAddComment}
              icon={<SendOutlined />}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send 💫
            </SendButton>
          </CommentForm>
        </CommentSection>
      </GlassCard>
    </PageContainer>
  )
}

export default PaintingComponent

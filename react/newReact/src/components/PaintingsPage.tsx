"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, Button, message, Spin, notification, Input } from "antd"
import type { AppDispatch, StoreType } from "../store/store"
import { ESubject, fetchPaintingsAsync, type PaintingType, uploadPaintingAsync } from "../store/paintingSlice"
import ShowPainting from "./ShowPainting"
import PaintingUploadModal from "./PaintingUploadModal"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"
import PopularPaintings from "./PopularPaintings"
import LatestPaintings from "./LatestPaintings"
import MagicWandOutlined,{ CloudUploadOutlined, SearchOutlined } from "@ant-design/icons"


const PageContainer = styled(motion.div)`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 40px 6vw;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 24px 4vw;
  }
`

const PageTitle = styled(motion.h1)`
  text-align: center;
  margin-bottom: 40px;
  font-weight: 900;
  font-size: 4rem;
  letter-spacing: 4px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
  position: relative;

  &::after {
    content: '✨';
    position: absolute;
    top: -20px;
    right: -40px;
    font-size: 2rem;
    animation: sparkle 2s ease-in-out infinite;
  }

  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`

const UploadButton = styled(motion(Button))`
  border-radius: 25px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 200% 200%;
  color: white;
  font-weight: 800;
  font-size: 18px;
  height: 64px;
  margin-bottom: 40px;
  padding: 0 40px;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.8s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
    background-position: 100% 0;
    border: none;
    color: white;
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }
`

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(102, 126, 234, 0.9);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const LoadingContent = styled(motion.div)`
  text-align: center;
  color: white;
`

const SearchContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto 40px;
  position: relative;
`

const SearchInput = styled(Input)`
  height: 60px;
  border-radius: 30px;
  padding: 0 30px 0 60px;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 107, 107, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:focus, &:hover {
    border-color: #ff6b6b;
    box-shadow: 0 15px 40px rgba(255, 107, 107, 0.3);
    transform: translateY(-3px);
  }
  
  &::placeholder {
    color: rgba(102, 102, 102, 0.6);
    font-weight: 500;
  }
`

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: #ff6b6b;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MagicButton = styled(motion(Button))`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border: none;
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  z-index: 2;
  
  &:hover {
    background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
  }
  
  .anticon {
    color: white;
    font-size: 18px;
  }
`

const NoResultsMessage = styled(motion.div)`
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 40px auto;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 15px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
    font-weight: 600;
  }
`

const PaintingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const paintings = useSelector((store: StoreType) => store.painting.paintings)
  const token = useSelector((store: StoreType) => store.user.token)
  const userId = useSelector((store: StoreType) => store.user.user.id)
  const loading = useSelector((store: StoreType) => store.painting.loading)
  const error = useSelector((store: StoreType) => store.painting.error)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paintingUploadLoading, setPaintingUploadLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const subjectFilter = query.get("subject")

  useEffect(() => {
    dispatch(fetchPaintingsAsync())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      notification.error({
        message: "🚨 Oops!",
        description: error,
        duration: 4,
        style: {
          borderRadius: 15,
          background: "linear-gradient(135deg, #ff6b6b, #ff8e8e)",
          color: "white",
        },
      })
    }
  }, [error])

  const handleUpload = async (paintingData: any) => {
    setPaintingUploadLoading(true)
    try {
      const resultAction = await dispatch(uploadPaintingAsync({ painting: paintingData, token: token || "" }))
      if (uploadPaintingAsync.fulfilled.match(resultAction)) {
        message.success({
          content: "🎨 Masterpiece uploaded successfully!",
          style: { borderRadius: 15 },
        })
        setIsModalVisible(false)
      } else {
        message.error({
          content: "❌ Failed to upload painting",
          style: { borderRadius: 15 },
        })
      }
    } catch (error) {
      message.error({
        content: "❌ Failed to upload painting",
        style: { borderRadius: 15 },
      })
    } finally {
      setPaintingUploadLoading(false)
    }
  }

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleMagicSearch = () => {
    // Generate a random search term from existing painting names
    if (paintings.length > 0) {
      const randomPainting = paintings[Math.floor(Math.random() * paintings.length)]
      const words = randomPainting.name.split(" ")
      const randomWord = words[Math.floor(Math.random() * words.length)]
      setSearchQuery(randomWord)

      message.success({
        content: `✨ Magic search: "${randomWord}"`,
        style: { borderRadius: 15 },
      })
    }
  }

  // Filter paintings by both subject and search query
  const filteredPaintings = paintings.filter((p: PaintingType) => {
    const matchesSubject = !subjectFilter || ESubject[p.subject] === subjectFilter
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSubject && matchesSearch
  })

  return (
    <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {loading && (
        <LoadingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoadingContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ marginBottom: 20 }}
            >
              <Spin size="large" />
            </motion.div>
            <motion.h2
              style={{ color: "white", fontSize: "2rem", fontWeight: 800, marginBottom: 10 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              🎨 Loading Art Magic...
            </motion.h2>
            <motion.p
              style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.2rem" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Preparing your gallery experience ✨
            </motion.p>
          </LoadingContent>
        </LoadingOverlay>
      )}

      <PageTitle
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        🎨 Art Gallery
      </PageTitle>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <PopularPaintings />
      </motion.div>

      <SearchContainer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <SearchIconWrapper>
          <SearchOutlined />
        </SearchIconWrapper>
        <SearchInput
          placeholder="Search for masterpieces by name..."
          value={searchQuery}
          onChange={handleSearch}
          allowClear
        />
        <MagicButton
          icon={<MagicWandOutlined />}
          onClick={handleMagicSearch}
          whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
          whileTap={{ scale: 0.9 }}
        />
      </SearchContainer>

      <motion.div
        style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <UploadButton
          type="primary"
          onClick={showModal}
          icon={<CloudUploadOutlined />}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 Upload New Masterpiece
        </UploadButton>
      </motion.div>

      <PaintingUploadModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onUpload={handleUpload}
        loading={paintingUploadLoading}
        userId={userId}
        token={token}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }}>
        {filteredPaintings.length > 0 ? (
          <Row gutter={[32, 32]} style={{ marginTop: 20 }}>
            {filteredPaintings.map((painting: PaintingType, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={painting.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <ShowPainting painting={painting} />
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <NoResultsMessage
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              style={{ fontSize: "4rem", marginBottom: 20 }}
            >
              🔍
            </motion.div>
            <h3>No Masterpieces Found</h3>
            <p>Try adjusting your search or filters to discover more art!</p>
          </NoResultsMessage>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <LatestPaintings />
      </motion.div>
    </PageContainer>
  )
}

export default PaintingsPage

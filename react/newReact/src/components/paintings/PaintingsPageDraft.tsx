"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col,  message, notification, Input } from "antd"
import type { AppDispatch, StoreType } from "../../store/store"
import {  fetchPaintingsAsync, type PaintingType, uploadPaintingAsync } from "../../store/paintingSlice"
import ShowPainting from "./ShowPainting"
import PaintingUploadModal from "./PaintingUploadModal"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import PopularPaintings from "./PopularPaintings"
import LatestPaintings from "./LatestPaintings"
import MagicWandOutlined,{ CloudUploadOutlined, SearchOutlined } from "@ant-design/icons"
import { AppSpinner } from "../common/AppSpinner"
import { AppEmpty } from "../common/AppEmpty"
import { getCategoryNameById } from "../../store/categorySlice"
// import './CSSPages/PaintingsPage.css'



const PaintingsPageDraft: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const paintings = useSelector((store: StoreType) => store.painting.paintings)
  const userId = useSelector((store: StoreType) => store.user.user.id)
  const loading = useSelector((store: StoreType) => store.painting.loading)
  const error = useSelector((store: StoreType) => store.painting.error)
  const categories = useSelector((store: StoreType) => store.categories.categories)
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
      const resultAction = await dispatch(uploadPaintingAsync({ painting: paintingData}))
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
  const filteredPaintings = paintings?.filter((p: PaintingType) => {
    const matchesSubject = !subjectFilter || p.category === categories.find((c) => c.name === subjectFilter)?.id
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSubject && matchesSearch
  })

  return (
  <motion.div
    className="page-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {loading &&<AppSpinner/>}

    <motion.h1
      className="page-title"
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, type: "spring" }}
    >
      🎨 Art Gallery
    </motion.h1>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <PopularPaintings />
    </motion.div>

    <motion.div
      className="search-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      <div className="search-icon-wrapper">
        <SearchOutlined />
      </div>
      <Input
        className="search-input"
        placeholder="Search for masterpieces by name..."
        value={searchQuery}
        onChange={handleSearch}
        allowClear
      />
      <motion.button
        className="magic-button"
        type="button"
        onClick={handleMagicSearch}
        whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
        whileTap={{ scale: 0.9 }}
        style={{ border: "none", background: "none", padding: 0 }}
      >
        <MagicWandOutlined />
      </motion.button>
    </motion.div>

    <motion.div
      style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <motion.button
        className="upload-button"
        type="button"
        onClick={showModal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CloudUploadOutlined style={{ marginRight: 8 }} />
        🚀 Upload New Masterpiece
      </motion.button>
    </motion.div>

    <PaintingUploadModal
      visible={isModalVisible}
      onCancel={handleCancel}
      onUpload={handleUpload}
      loading={paintingUploadLoading}
      userId={userId}
    />

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 1 }}>
      {filteredPaintings.length > 0 ? (
        <Row gutter={[32, 32]} style={{ marginTop: 20 ,maxWidth:"95%"}}>
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
                <ShowPainting painting={painting} category={getCategoryNameById(categories,painting.category)} userId={userId} />
              </motion.div>
            </Col>
          ))}
        </Row>
      ) : (
        <AppEmpty description="No masterpieces found! Try adjusting your search or explore other subjects." />
      )}
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <LatestPaintings />
    </motion.div>
  </motion.div>
);
}

export default PaintingsPageDraft

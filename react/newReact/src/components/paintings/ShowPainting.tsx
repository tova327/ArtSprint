"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LikeOutlined,  RightCircleTwoTone, LikeFilled } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import { addLikeAsync, addLikeR } from "../../store/paintingSlice"
import type { AppDispatch } from "../../store/store"
import { type PaintingType } from "../../store/paintingSlice"
import DownloadButton from "../common/DownloadButton"
import useAlert from "../../Hooks/useAlert"
import { AppAlert } from "../common/AppAlert"
import AppCard from "../common/AppCard"
import AppTitle from "../common/AppTitle"
import DeletePaintingButton from "./DeletePaintingButton"
import AppTag from "../common/AppTag"
import { themeToken } from "../../theme/token"
import { AppImagePreview } from "../common/AppImage"
import AppButton from "../common/AppButton"
import { Flex } from "antd"


const ShowPainting = ({ painting,category, userId }: { painting: PaintingType ,category: string, userId: number }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const [sessionLikes, setSessionLikes] = useState(0)
  // const categories = useSelector((state: StoreType) => state.categories.categories)
  const {alert,handleOpenAlert} =useAlert({type: 'success', message: '', isVisible: false})
  const handleNavigate = () => {
    sessionStorage.setItem("lastPaintingCaller", location.pathname + location.search)
    navigate(`/painting/${painting.id}`)
  }

  const handleLike = async () => {
    
    if (sessionLikes >= 1) {
     handleOpenAlert("warning", "You've already loved this masterpiece during this session!")
      return
    }

    let addLike = true
    handleOpenAlert("info", "Your love is being sent...💌")
   

    if (addLike) {
      dispatch(addLikeR(painting.id))
      setSessionLikes((prevLikes) => prevLikes + 1)
      try {
        await dispatch(addLikeAsync({ id: painting.id, count: 1})).unwrap()
        handleOpenAlert("success", "🎉 Love sent successfully!")
      } catch (error) {
        setSessionLikes((prevLikes) => prevLikes - 1)
        handleOpenAlert("error", "💔 Failed to send love. Try again!")
      }
        
      }
    }
  


  return (
  <>
    {alert.isVisible && (
      <AppAlert {...alert} />
    )}

    <AppCard
      style={{ width: "100%" }}
      bodyStyle={{ padding: 10 }}
    >
      <Flex gap={10} align="center">

        {/* IMAGE */}
        <AppImagePreview
          src={painting.url}
          style={{
            width: 90,
            height: 70,
            objectFit: "cover",
            borderRadius: 8,
            flexShrink: 0,
          }}
        />

        {/* CONTENT */}
        <Flex vertical style={{ flex: 1, minWidth: 0 }} gap={4}>

          {/* TITLE */}
          <Flex justify="space-between" align="center">
            <AppTitle
              level={5}
              style={{
                margin: 0,
                fontSize: 14,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {painting.name}
            </AppTitle>

            <Flex gap={4}>
              <DownloadButton url={painting.url} />
              {painting.ownerId === userId && (
                <DeletePaintingButton painting={painting} />
              )}
            </Flex>
          </Flex>

          {/* TAGS */}
          <Flex justify="space-between">
            <AppTag color={themeToken.token?.colorTextSecondary}>
              {category}
            </AppTag>

            <AppTag>
              {painting.likes + sessionLikes}
              <LikeFilled style={{ marginLeft: 4 }} />
            </AppTag>
          </Flex>

          {/* ACTIONS */}
          <Flex justify="space-between">
            <AppButton
             
              type="text"
              onClick={handleLike}
              icon={sessionLikes ? <LikeFilled /> : <LikeOutlined />}
            >
              Love
            </AppButton>

            <AppButton
            
              onClick={handleNavigate}
              icon={<RightCircleTwoTone />}
            >
              View
            </AppButton>
          </Flex>

        </Flex>
      </Flex>
    </AppCard>
  </>
)
}

export default ShowPainting

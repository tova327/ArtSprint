"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LikeOutlined, ContainerOutlined, RightCircleTwoTone } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import { addLikeAsync, addLikeR } from "../../store/paintingSlice"
import type { AppDispatch } from "../../store/store"
import { type PaintingType } from "../../store/paintingSlice"
import UserDetails from "../user/UserDetails"
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
import { AppCaption } from "../common/AppText"
import { Flex } from "antd"
import { spacing } from "../../theme/constant"


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
  <AppCard>
    <Flex vertical gap={spacing.md}>
      
      <Flex justify="space-between" align="flex-start" gap={spacing.sm}>
        <AppTitle>
          {painting.name}
        </AppTitle>

        <Flex gap={spacing.xs}>
          <DownloadButton url={painting.url} />

          {painting.ownerId === userId && (
            <DeletePaintingButton painting={painting} />
          )}
        </Flex>
      </Flex>

      <UserDetails id={painting.ownerId} short={true} />

      <Flex wrap gap={spacing.sm}>
        <AppTag color={themeToken.token?.colorTextSecondary}>
          <ContainerOutlined twoToneColor={themeToken.token?.colorInfo} />
          {category}
        </AppTag>

        <AppTag color={themeToken.token?.colorText}>
          <LikeOutlined twoToneColor={themeToken.token?.colorPrimary} />
          {painting.likes + sessionLikes}
        </AppTag>
      </Flex>

      <AppImagePreview src={painting.url} />

      <Flex justify="space-between" align="center">
        <AppButton
          type="dashed"
          onClick={handleLike}
          icon={<LikeOutlined />}
        >
          <AppCaption>Like</AppCaption>
        </AppButton>

        <AppButton onClick={handleNavigate}>
          <RightCircleTwoTone />
        </AppButton>
      </Flex>

      <AppAlert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
      />
    </Flex>
  </AppCard>
);
}

export default ShowPainting

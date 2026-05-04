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
  


  return (alert.isVisible ? <AppAlert type={alert.type} message={alert.message} isVisible={alert.isVisible} /> : (
  <AppCard
  style={{
    height:"100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
  bodyStyle={{ padding: 12 }}
>
  <Flex vertical gap={8} style={{ height: "100%",width: "100%" }}>

    {/* Title + actions */}
    <Flex justify="space-between" align="center" vertical>
      <AppTitle level={5} style={{ margin: 0 ,display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"70%"}}>
        {painting.name}
      </AppTitle>

      <Flex gap={4} justify="space-between" align="center" vertical={false}>
        <DownloadButton url={painting.url} />
        {painting.ownerId === userId && (
          <DeletePaintingButton painting={painting}  />
        )}
      </Flex>
    </Flex>

    {/* Image */}
    <AppImagePreview
      src={painting.url}
      style={{
        height: 70,
        objectFit: "cover",
        borderRadius: 12,
        width:"80%"
      }}
    />

    {/* Tags */}
    <Flex justify="space-between" vertical={false} align="center">
      <AppTag color={themeToken.token?.colorTextSecondary}>
        {category}
      </AppTag>
      <AppTag>
        {painting.likes + sessionLikes}<LikeFilled style={{ marginLeft: 4 }} />
      </AppTag>
    </Flex>

    {/* Actions */}
    <Flex justify="space-between" vertical={false} align="center">
      <AppButton  onClick={handleLike}>
        <LikeOutlined /> Love
      </AppButton>

      <AppButton  onClick={handleNavigate} icon={<RightCircleTwoTone />}>
         View
      </AppButton>
    </Flex>

  </Flex>
</AppCard>
));
}

export default ShowPainting

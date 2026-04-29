import  { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { List, message, Flex } from "antd"
import { useDispatch, useSelector } from "react-redux"

import type { PaintingType } from "../../store/paintingSlice"
import type { CommentPostModel } from "../../store/commentSlice"
import { fetchCommentsAsync, addCommentAsync } from "../../store/commentSlice"
import type { AppDispatch, StoreType } from "../../store/store"

import UserDetails from "../user/UserDetails"
import DownloadButton from "../common/DownloadButton"
import DeletePaintingButton from "./DeletePaintingButton"

import AppCard from "../common/AppCard"
import { spacing } from "../../theme/constant"
import AppButton from "../common/AppButton"
import { AppEmpty } from "../common/AppEmpty"
import { AppImageLarge } from "../common/AppImage"
import AppInput from "../common/AppInput"
import { AppSpinner } from "../common/AppSpinner"
import AppTag from "../common/AppTag"
import { AppCaption, AppParagraph } from "../common/AppText"
import AppTitle from "../common/AppTitle"
import AppSection from "../common/AppSection"
import { AppResult } from "../common/AppResult"


const PaintingComponent = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [painting, setPainting] = useState<PaintingType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState<string>("")

  const comments = useSelector((store: StoreType) => store.comments.comments)
  const userId = useSelector((store: StoreType) => store.user.user.id)
  const allUsers = useSelector((store: StoreType) => store.user.allusers)

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_MY_API_URL}Painting/${id}`)
        if (!response.ok) throw new Error("Failed to fetch painting")
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
    if (!commentContent.trim()) {
      message.error("Please enter a comment")
      return
    }

    const newComment: CommentPostModel = {
      content: commentContent,
      userId: userId,
      paintId: Number(id),
    }

    const resultAction = await dispatch(addCommentAsync({ comment: newComment }))

    if (addCommentAsync.fulfilled.match(resultAction)) {
      message.success("Comment added")
      setCommentContent("")
    } else {
      message.error("Failed to add comment")
    }
  }

  if (loading) {
    return <AppSpinner />
  }

  if (error) {
    return <AppResult status="error" title={error} onAction={function (): void {
      throw new Error("Function not implemented.")
    }} />
  }

  if (!painting) {
    return <AppResult status="error" title="Painting not found" onAction={function (): void {
      throw new Error("Function not implemented.")
    }} />
  }

  const paintingComments = comments.filter((c) => c.paintId === painting.id)

  return (
    <AppCard>
      <Flex vertical gap={spacing.xl}>

        {/* Back */}
        <AppSection>
          <AppButton onClick={handleBack} type="link">
            Back
          </AppButton>
        </AppSection>

        {/* Title + User */}
        <AppSection>
          <AppTitle>{painting.name}</AppTitle>
          <UserDetails id={painting.ownerId} short={false} />
        </AppSection>

        {/* Image */}
        <AppSection>
          <AppImageLarge src={painting.url} alt={painting.name} />
        </AppSection>

        {/* Actions */}
        <AppSection>
          <Flex gap={spacing.md}>
            <DownloadButton url={painting.url} label={`Download ${painting.name}`} />
            {painting.ownerId === userId && (
              <DeletePaintingButton painting={painting} />
            )}
          </Flex>
        </AppSection>

        {/* Comments */}
        <AppSection>
          <AppTitle>Comments</AppTitle>

          {paintingComments.length === 0 ? (
            <AppEmpty description="No comments yet" />
          ) : (
            <List
              dataSource={paintingComments}
              renderItem={(item) => {
                const user = allUsers?.find((u) => u.id === item.userId)

                return (
                  <Flex vertical gap={spacing.xs} style={{ marginBottom: spacing.md }}>
                    <AppTag>
                      <AppCaption>{user?.name || "Unknown"}</AppCaption>
                    </AppTag>

                    <AppParagraph>{item.content}</AppParagraph>
                  </Flex>
                )
              }}
            />
          )}

          {/* Add Comment */}
          <Flex gap={spacing.sm} style={{ marginTop: spacing.md }}>
            <AppInput
              value={commentContent}
              onChange={(e: any) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              onPressEnter={handleAddComment}
            />

            <AppButton type="primary" onClick={handleAddComment}>
              Send
            </AppButton>
          </Flex>
        </AppSection>

      </Flex>
    </AppCard>
  )
}

export default PaintingComponent
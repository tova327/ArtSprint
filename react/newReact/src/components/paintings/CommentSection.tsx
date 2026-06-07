import { List, Card, Flex, Avatar, Typography, Space, Input, Button } from "antd"
import { AppEmpty } from "../common/AppEmpty"
import AppSection from "../common/AppSection"
import AppTitle from "../common/AppTitle"
import { CommentType } from "../../store/commentSlice"
import { UserType } from "../../store/userSlice"

const CommentSection=({paintingComments, allUsers, commentContent, setCommentContent, handleAddComment}:{paintingComments:CommentType[], allUsers: UserType[], commentContent: string, setCommentContent: React.Dispatch<React.SetStateAction<string>>, handleAddComment: () => void}) => {
   return(
    <AppSection>
      <AppTitle>Comments</AppTitle>

  {paintingComments.length === 0 ? (
    <AppEmpty description="No comments yet" />
  ) : (
    <List
      itemLayout="vertical"
      dataSource={paintingComments}
      renderItem={(item) => {
        const user = allUsers?.find((u) => u.id === item.userId)

        return (
          <Card
            size="small"
            style={{
              marginBottom: 12,
              borderRadius: 12,
            }}
          >
            <Flex gap={12} align="flex-start">
              <Avatar size={40}>
                {(user?.name || "U")[0].toUpperCase()}
              </Avatar>

              <Flex vertical style={{ width: "100%" }}>
                <Typography.Text strong>
                  {user?.name || "Unknown"}
                </Typography.Text>

                <Typography.Paragraph
                  style={{
                    marginTop: 4,
                    marginBottom: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.content}
                </Typography.Paragraph>
              </Flex>
            </Flex>
          </Card>
        )
      }}
    />
  )}

  {/* Add Comment */}
  <Card
    size="small"
    style={{
      marginTop: 16,
      borderRadius: 12,
    }}
  >
    <Space.Compact style={{ width: "100%" }}>
      <Input
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        onPressEnter={handleAddComment}
      />

      <Button type="primary" onClick={handleAddComment}>
        Send
      </Button>
    </Space.Compact>
  </Card>
</AppSection>)
}
export default CommentSection;
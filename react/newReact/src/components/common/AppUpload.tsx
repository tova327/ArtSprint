// AppUpload.tsx

import React from "react"
import { Upload } from "antd"
import type { UploadFile, UploadProps } from "antd/es/upload/interface"
import { InboxOutlined } from "@ant-design/icons"

type Props = {
  fileList: UploadFile[]
  onChange: UploadProps["onChange"]
  accept?: string
  maxCount?: number
  disabled?: boolean
}

const AppUpload: React.FC<Props> = ({
  fileList,
  onChange,
  accept = "image/*",
  maxCount = 1,
  disabled = false,
}) => {
  return (
    <Upload.Dragger
      beforeUpload={() => false}
      fileList={fileList}
      onChange={onChange}
      accept={accept}
      maxCount={maxCount}
      disabled={disabled}
      listType="picture"
      multiple={false}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>

      <p className="ant-upload-text">
        Click or drag image to upload
      </p>

      <p className="ant-upload-hint">
        Only image files are supported
      </p>
    </Upload.Dragger>
  )
}

export default AppUpload
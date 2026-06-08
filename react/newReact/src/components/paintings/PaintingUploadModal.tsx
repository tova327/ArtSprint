// PaintingUploadModal.tsx

"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Flex, Form } from "antd"
import type { UploadFile } from "antd/es/upload/interface"
import { useSelector } from "react-redux"

import type { StoreType } from "../../store/store"

import AppModal from "../common/AppModal"
import AppTitle from "../common/AppTitle"
import AppInput from "../common/AppInput"
import AppButton from "../common/AppButton"
import AppForm from "../common/AppForm"
import AppFormItem from "../common/AppFormItem"
import AppSection from "../common/AppSection"


import AppUpload from "../common/AppUpload"
import AppProgress from "../common/AppProgress"
import AppSelect from "../common/AppSelect"
import { PaintingToAddType } from "../../store/paintingSlice"
import { spacing } from "../../theme/constant"
import { AppImagePreview } from "../common/AppImage"
import { AppParagraph } from "../common/AppText"
import useAlert from "../../Hooks/useAlert"
import { AppAlert } from "../common/AppAlert"




type Props = {
  visible: boolean
  onCancel: () => void
  onUpload: (painting: PaintingToAddType) => Promise<void>
  loading: boolean
  userId: number
}

const PaintingUploadModal: React.FC<Props> = ({
  visible,
  onCancel,
  onUpload,
  loading,
  userId,
}) => {
  const [form] = Form.useForm()

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [paintingFile, setPaintingFile] = useState<File | null>(null)

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
const {alert, handleOpenAlert} = useAlert({type: 'success', message: '', isVisible: false})
  const categories = useSelector(
    (state: StoreType) => state.categories.categories
  )

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      setPaintingFile(null)
      setFileList([])
      setUploadProgress(0)
      setIsUploading(false)
    }
  }, [visible, form])

  const handleFileChange = (info: any) => {
    const latestFileList = info.fileList.slice(-1)

    setFileList(latestFileList)

    if (latestFileList.length > 0&& latestFileList[0].originFileObj) {
      setPaintingFile(latestFileList[0].originFileObj)

      form.setFields([
        {
          name: "paintingFile",
          errors: [],
        },
      ])
    } else {
      setPaintingFile(null)
    }
  }

  const imagePreview = useMemo(() => {
    if (!paintingFile) return undefined
    return URL.createObjectURL(paintingFile)
  }, [paintingFile])

  const handleUpload = async (values: any) => {
    if (!paintingFile) {
      form.setFields([
        {
          name: "paintingFile",
          errors: ["Please upload image"],
        },
      ])

      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    let interval: number | null = null

    try {
      interval = window.setInterval(() => {
        setUploadProgress((prev) =>
          prev >= 90 ? 90 : prev + Math.random() * 15
        )
      }, 200)

      await onUpload({
        ownerId: userId,
        name: values.name,
        categoryId: values.categoryId,
        paintingFile,
      })

      if (interval) clearInterval(interval)

      setUploadProgress(100)

     handleOpenAlert("success", "Painting uploaded successfully!")

      setTimeout(() => {
        form.resetFields()
        setPaintingFile(null)
        setFileList([])
        setUploadProgress(0)
        setIsUploading(false)
      }, 800)
    } catch (error) {
      if (interval) clearInterval(interval)

      setUploadProgress(0)
      setIsUploading(false)

     handleOpenAlert("error", "Failed to upload painting. Please try again.")
    }
  }
  
//title, description, actions, visible, onClose
  return (
    <AppModal
      visible={visible}
      onClose={onCancel}
      actions={[{label: "Cancel", onClick: onCancel}]}
      title="Upload Your Masterpiece"
      description={<Flex vertical gap={spacing.lg}>
        <AppAlert type={alert.type} message={alert.message} isVisible={alert.isVisible} />
        <AppSection>
          <AppTitle>
            Upload Painting
          </AppTitle>

          <AppParagraph>
            Share your artwork with the community.
          </AppParagraph>
        </AppSection>

        <AppForm
          form={form}
          layout="vertical"
          onFinish={handleUpload}
        >
          <Flex vertical gap={spacing.lg}>

            <AppSection>
              <AppFormItem
                name="name"
                label="Painting Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter painting name",
                  },
                ]}
              >
                <AppInput placeholder="Painting name" />
              </AppFormItem>
            </AppSection>

            <AppSection>
              <AppFormItem
                name="categoryId"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please select category",
                  },
                ]}
              >
                <AppSelect
                  placeholder="Select category"
                  options={
                    categories?.map((category) => ({
                      label: category.name,
                      value: category.id,
                    })) || []
                  }
                />
              </AppFormItem>
            </AppSection>

            <AppSection>
              <AppFormItem
                name="paintingFile"
                label="Upload Image"
                rules={[
                  {
                    validator: () => {
                      if (paintingFile) {
                        return Promise.resolve()
                      }

                      return Promise.reject(
                        new Error("Please upload image")
                      )
                    },
                  },
                ]}
              >
                <AppUpload
                  fileList={fileList}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </AppFormItem>

              {imagePreview && (
                <AppImagePreview
                  src={imagePreview}
                />
              )}
            </AppSection>

            {isUploading && (
              <AppSection>
                <AppProgress
                  percent={uploadProgress}
                />
              </AppSection>
            )}

            <AppButton
              type="primary"
              htmlType="submit"
              loading={loading || isUploading}
              disabled={loading || isUploading}
            >
              Upload Painting
            </AppButton>

          </Flex>
        </AppForm>
      </Flex>}
        
    />
      
    
  )
}

export default PaintingUploadModal
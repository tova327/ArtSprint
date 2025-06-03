"use client"

import styled from "styled-components"
import { motion } from "framer-motion"
import { FileTextOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons"

const GlassText = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 30px;
  margin: 20px 0;
  backdrop-filter: blur(15px);
  border: 3px solid rgba(76, 201, 196, 0.3);
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

const FileViewer = styled(motion.div)`
  position: relative;
  z-index: 1;
  
  object {
    width: 100%;
    min-height: 500px;
    border-radius: 15px;
    border: 3px solid rgba(76, 201, 196, 0.3);
    background: white;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`

const FileHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 3px solid rgba(76, 201, 196, 0.2);
`

const FileIcon = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 20px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
`

const FileTitle = styled(motion.h4)`
  margin: 0;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: 1.5rem;
`

const FileDescription = styled(motion.p)`
  margin: 5px 0 0 0;
  color: #666;
  font-size: 16px;
  font-weight: 600;
`

const FallbackContainer = styled(motion.div)`
  padding: 50px;
  text-align: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 15px;
  border: 3px dashed rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`

const DocumentIcon = styled(motion.div)`
  font-size: 4rem;
  margin-bottom: 20px;
  color: #667eea;
`

const ActionButton = styled(motion.a)`
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  border-radius: 15px;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  margin: 10px;
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
    background: linear-gradient(45deg, #764ba2, #667eea);
  }
`

function TextFileDisplay({ fileUrl }: { fileUrl: string }) {
  return (
    <GlassText initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      <FileHeader
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <FileIcon
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <FileTextOutlined />
        </FileIcon>
        <div>
          <FileTitle initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
            📄 Document Viewer
          </FileTitle>
          <FileDescription initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            Click to explore the full document ✨
          </FileDescription>
        </div>
      </FileHeader>

      <FileViewer
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        whileHover={{ scale: 1.01 }}
      >
        <object data={fileUrl} width="100%" height="500" >
          <FallbackContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <DocumentIcon
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              📄
            </DocumentIcon>

            <motion.h3
              style={{
                color: "#667eea",
                marginBottom: 15,
                fontSize: "1.8rem",
                fontWeight: 900,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              📖 Document Preview
            </motion.h3>

            <motion.p
              style={{
                color: "#666",
                marginBottom: 25,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Your browser doesn't support embedded PDFs.
              <br />
              Click below to view the full document! 🚀
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <ActionButton
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <EyeOutlined style={{ marginRight: 8 }} />
                Open Document
              </ActionButton>

              <ActionButton href={fileUrl} download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DownloadOutlined style={{ marginRight: 8 }} />
                Download
              </ActionButton>
            </motion.div>
          </FallbackContainer>
        </object>
      </FileViewer>
    </GlassText>
  )
}

export default TextFileDisplay

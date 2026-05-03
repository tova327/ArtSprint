import type React from "react"
import { useEffect } from "react"
import {  Routes, Route } from "react-router-dom"
import { Layout } from "antd"

import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store/store"
import PaintingComponent from "./paintings/PaintingComponent"
import ProtectedRoute from "./auth/ProtectedRoute"
import StartPage from "./auth/StartPage"
import PaintingsPage from "./paintings/PaintingsPage"
import NavBarDraft from "./layout/NavBarDraft"
import { fetchPaintingsAsync } from "../store/paintingSlice"
import Sider from "antd/es/layout/Sider"
import AppSection from "./common/AppSection"

const { Content } = Layout



const SubApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchPaintingsAsync())
  }, [dispatch])

  return (
    <AppSection>
     
        <Layout style={{ minHeight: "100vh", maxWidth: "100vw", background: "transparent" }}>
          <Sider  style={{minHeight: "100%", background: "transparent", borderRight: "1px solid rgba(255, 255, 255, 0.2)" }}>
          <NavBarDraft />
          </Sider>
          <Content style={{ padding: "16px 20px 20px", background: "transparent" }}>
           
              <Routes>
                
                <Route path="/" element={<ProtectedRoute><PaintingsPage /></ProtectedRoute>} />
                <Route path="/painting/:id" element={<ProtectedRoute><PaintingComponent /></ProtectedRoute>} />
                <Route path="/login" element={<StartPage />} />
              </Routes>
           
          </Content>
        </Layout>
      
    </AppSection>
  )
}

export default SubApp


//  <Layout style={layoutStyle}>
//       <Header style={headerStyle}>Header</Header>
//       <Layout>
//         <Sider width="25%" style={siderStyle}>
//           Sider
//         </Sider>
//         <Content style={contentStyle}>Content</Content>
//       </Layout>
//       <Footer style={footerStyle}>Footer</Footer>
//     </Layout>

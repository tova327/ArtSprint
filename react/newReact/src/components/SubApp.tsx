import type React from "react"
import { useEffect, useState } from "react"
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
import AppSection from "./common/AppSection"
import { themeToken } from "../theme/token"
import AppSider from "./common/AppSider"

const { Content } = Layout



const SubApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchPaintingsAsync())
  }, [dispatch])
const [collapsed, setCollapsed] = useState(false);
const toggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };
  return (
    <AppSection>
     
        <Layout hasSider style={{ minHeight: "100vh", maxWidth: "100vw", background: "transparent" }}>
          <AppSider  collapsed={collapsed} toggleCollapsed={toggleCollapsed}>
          <NavBarDraft />
          </AppSider>
          <Content style={{ padding: themeToken.token?.padding, minHeight: "100%", width: collapsed ? "100%" : "80%", maxWidth: "100%" }}>
           
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

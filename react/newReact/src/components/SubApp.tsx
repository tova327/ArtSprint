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
import Sider from "antd/es/layout/Sider"

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
    const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};
  return (
    <AppSection>
     
        <Layout hasSider style={{ minHeight: "100vh", maxWidth: "100vw", background: "transparent" }}>
          <Sider  width={260} collapsed={collapsed} collapsible onCollapse={toggleCollapsed} style={{...siderStyle,borderRight: themeToken.token?.colorBorder, flex: "0 0 260px", maxWidth: "20%", minWidth: "20%"}}>
          <NavBarDraft />
          </Sider>
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

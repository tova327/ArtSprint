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
import Sider from "antd/es/layout/Sider"
import AppSection from "./common/AppSection"
import AppButton from "./common/AppButton"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";

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
     
        <Layout style={{ minHeight: "100vh", maxWidth: "100vw", background: "transparent" }}>
          <Sider collapsed={collapsed} collapsible onCollapse={toggleCollapsed} width={260} style={{ minHeight: "100%", background: "transparent", borderRight: "1px solid rgba(255, 255, 255, 0.2)", flex: "0 0 260px", maxWidth: 260, minWidth: 260 }}>
         <AppButton
                         type="primary"
                         onClick={toggleCollapsed}
                         style={{ marginBottom: 16 }}
                     >
                         {collapsed
                             ? <MenuUnfoldOutlined />
                             : <MenuFoldOutlined />}
                     </AppButton>
         
          <NavBarDraft />
          </Sider>
          <Content style={{ padding: "24px", background: "transparent" }}>
           
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

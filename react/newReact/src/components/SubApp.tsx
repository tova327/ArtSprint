import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './NavBar';
import PaintingsPage from './PaintingsPage';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { fetchPaintings } from '../store/axioscalls';
import PaintingComponent from './PaintingComponent';
import { styled } from 'styled-components';

const { Content } = Layout;
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 32px 6vw 0 6vw;
  display: flex;
  flex-direction: column;
  @media (max-width: 900px) {
    padding: 24px 2vw 0 2vw;
  }
  @media (max-width: 600px) {
    padding: 12px 0 0 0;
  }
`;
const SubApp: React.FC = () => {

    const dispatch=useDispatch<AppDispatch>()

    useEffect(()=>{
        dispatch(fetchPaintings)
    },[dispatch])
  return (
    <PageContainer>
    <Router>
      <Layout style={{ minHeight: '100vh',minWidth:'100vw' }}>
        {/* <Header style={{backgroundColor:"Highlight"}}> */}
          <Navbar />
        {/* </Header> */}
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<PaintingsPage />} />
            <Route path="/painting/:id" element={<PaintingComponent />}/>
          </Routes>
        </Content>
      </Layout>
    </Router>
    </PageContainer>
  );
};

export default SubApp;
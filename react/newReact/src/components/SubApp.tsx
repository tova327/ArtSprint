import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './NavBar';
import PaintingsPage from './PaintingsPage';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { fetchPaintings } from '../store/axioscalls';
import PaintingComponent from './PaintingComponent';

const { Header, Content } = Layout;

const SubApp: React.FC = () => {

    const dispatch=useDispatch<AppDispatch>()

    useEffect(()=>{
        dispatch(fetchPaintings)
    },[dispatch])
  return (
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
  );
};

export default SubApp;
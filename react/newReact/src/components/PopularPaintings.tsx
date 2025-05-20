import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import { StoreType } from '../store/store';
import {  ESubject } from '../store/paintingSlice';
import { motion } from 'framer-motion';

const ticker = keyframes`
  0% { transform: translateX(100vw);}
  100% { transform: translateX(-100vw);}
`;

const TickerContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 24px;
  box-shadow: 0 4px 32px 0 rgba(255,175,189,0.12);
  margin-bottom: 32px;
  padding: 18px 0;
  position: relative;
`;

const PaintingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  min-width: 100vw;
  animation: ${ticker} 30s linear infinite;
`;

const PopularCard = styled(motion.div)`
  background: rgba(255,255,255,0.85);
  border-radius: 18px;
  box-shadow: 0 2px 18px 0 rgba(255,64,129,0.09);
  border: 2.5px solid #ff9800;
  min-width: 250px;
  max-width: 300px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 8px 38px 0 rgba(255,64,129,0.23);
    border-color: #ff4081;
    transform: scale(1.06);
  }
`;

const Medal = styled.div`
  font-size: 1.6rem;
  margin-bottom: 6px;
`;

const PopularPaintings: React.FC = () => {
  const paintings = useSelector((store: StoreType) => store.painting.paintings);

  // Define "popular": top 5 by likes or isMedal
  const topPaintings = [...paintings]
    .filter(p => p.isMedal || p.likes >= 2) // tune threshold as you wish
    .sort((a, b) => (b.likes - a.likes) || (b.isMedal ? 1 : -1))
    .slice(0, 8);

  if (!topPaintings.length) return null;

  return (
    <TickerContainer>
      <PaintingsRow style={{width: '100vw'}}>
        {topPaintings.map((painting, i) => (
          <PopularCard
            key={painting.id}
            whileHover={{ scale: 1.08, boxShadow: "0 12px 38px 0 rgba(255,64,129,0.25)" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring' }}
            onClick={() => window.location.href = `/painting/${painting.id}`}
          >
            {painting.isMedal && <Medal>🏅</Medal>}
            <div style={{
              fontWeight: 700, fontSize: '1.14rem', color: "#ff4081", marginBottom: 8, textAlign: 'center'
            }}>
              {painting.name}
            </div>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 5 }}>
              {ESubject[painting.subject]} | Likes: {painting.likes}
            </div>
            {['Drawing', 'Photography', 'Graphic'].includes(ESubject[painting.subject]) && (
              <img src={painting.url} alt={painting.name} style={{
                width: '100%', height: 70, objectFit: 'cover', borderRadius: 8
              }} />
            )}
            {ESubject[painting.subject] === 'Music' && <span>🎵 Music</span>}
            {ESubject[painting.subject] === 'Writing' && <span>📝 Writing</span>}
          </PopularCard>
        ))}
      </PaintingsRow>
    </TickerContainer>
  );
};

export default PopularPaintings;
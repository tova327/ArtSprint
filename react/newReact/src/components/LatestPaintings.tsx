import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { StoreType } from '../store/store';
import { ESubject } from '../store/paintingSlice';
import { motion } from 'framer-motion';

const GlassLatest = styled.div`
  background: rgba(255,255,255,0.93);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 14px 0 rgba(60,60,130,0.09);
  padding: 24px 4vw;
  margin-top: 48px;
`;

const LatestRow = styled.div`
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
`;

const LatestCard = styled(motion.div)`
  background: rgba(255,255,255,0.93);
  border-radius: 12px;
  box-shadow: 0 2px 14px 0 rgba(60,60,130,0.07);
  border: 2px solid #56c6ff;
  min-width: 180px;
  max-width: 200px;
  min-height: 90px;
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

const LatestPaintings = () => {
    const paintings = useSelector((store: StoreType) => store.painting.paintings);

    // Get latest 6 by createdAt (descending)
    const latest = [...paintings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    if (!latest.length) return null;

    return (
        <GlassLatest style={{width: '100vw'}}>
            <h3 style={{
              color: "#56c6ff", fontWeight: 700, marginBottom: 18, letterSpacing: 2, textAlign: "center"
            }}>Latest Paintings</h3>
            <LatestRow>
                {latest.map((painting, i) => (
                  <LatestCard
                    key={painting.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.09 }}
                    onClick={() => window.location.href = `/painting/${painting.id}`}
                  >
                    <span style={{ fontWeight: 600, color: "#3A3A5A" }}>{painting.name}</span>
                    <span style={{ fontSize: 13, color: "#888" }}>
                      {ESubject[painting.subject]}
                    </span>
                    {['Drawing', 'Photography', 'Graphic'].includes(ESubject[painting.subject]) && (
                      <img src={painting.url} alt={painting.name} style={{
                        width: '100%', height: 40, objectFit: 'cover', borderRadius: 6
                      }} />
                    )}
                  </LatestCard>
                ))}
            </LatestRow>
        </GlassLatest>
    );
};

export default LatestPaintings;
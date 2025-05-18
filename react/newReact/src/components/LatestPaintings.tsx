import styled from 'styled-components';

const GlassLatest = styled.div`
  background: rgba(255,255,255,0.88);
  border-radius: 16px;
  box-shadow: 0 2px 14px 0 rgba(60,60,130,0.09);
  padding: 20px;
  margin: 20px 0;
`;

const LatestPaintings = () => {
    return (
        <GlassLatest>
            {/* Put your latest paintings content here */}
        </GlassLatest>
    );
};

export default LatestPaintings;
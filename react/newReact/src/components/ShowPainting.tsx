import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, message, Tooltip } from 'antd';
import { ArrowRightOutlined, LikeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addLikeAsync, addLikeR } from '../store/paintingSlice';
import { AppDispatch, StoreType } from '../store/store';
import { PaintingType, ESubject } from '../store/paintingSlice';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GlassCard = styled(motion.div)`
  background: rgba(255,255,255,0.77);
  border: 2px solid ${({ theme }:{theme:any}) => theme.primary};
  border-radius: 24px;
  box-shadow: 0 8px 40px 0 rgba(60,60,170,0.10);
  margin: 20px 0;
  padding: 24px;
  transition: border 0.2s;
  &:hover {
    border: 2.5px solid ${({ theme }:{theme:any}) => theme.secondary};
    box-shadow: 0 16px 56px 0 rgba(255, 64, 129, 0.13);
  }
`;

const PaintingImg = styled(motion.img)`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 32px 0 rgba(60,60,170, 0.10);
`;

const ShowPainting = ({ painting }: { painting: PaintingType }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [sessionLikes, setSessionLikes] = useState(0);
    const token = useSelector((store: StoreType) => store.user.token);

    const handleNavigate = () => {
        navigate(`/painting/${painting.id}`);
    };

    const handleLike = async () => {
        if (!token) {
            message.warning('You must be logged in to like a painting.');
            return;
        }
        if (sessionLikes >= 10) {
            message.warning('You cannot add more than 10 likes to this painting in this session.');
            return;
        }
        dispatch(addLikeR(painting.id));
        setSessionLikes(prevLikes => prevLikes + 1);
        try {
            await dispatch(addLikeAsync({ id: painting.id, count: 1, token })).unwrap();
            message.success('You liked this painting!');
        } catch (error) {
            dispatch(addLikeR(painting.id));
            setSessionLikes(prevLikes => prevLikes - 1);
            message.error('Failed to like the painting. Please try again.');
        }
    };

    const renderContent = () => {
        const subject = ESubject[painting.subject];
        switch (subject) {
            case 'Music':
                return (
                    <audio controls style={{ width: '100%' }}>
                        <source src={painting.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                );
            case 'Drawing':
            case 'Photography':
            case 'Graphic':
                return (
                    <PaintingImg
                        src={painting.url}
                        alt={painting.name}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                );
            case 'Writing':
                return (
                    <pre
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: '#222',
                            borderRadius: 12,
                            padding: 16,
                            fontFamily: 'Montserrat, Poppins, monospace',
                            maxHeight: 200,
                            overflow: 'auto',
                        }}
                    >
                        {painting.name} from {painting.ownerId}
                    </pre>
                );
            default:
                return <p>Unsupported painting type.</p>;
        }
    };

    return (
        <GlassCard
            whileHover={{ scale: 1.025, boxShadow: "0 24px 60px 0 rgba(255,100,190,0.14)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
        >
            <h2 style={{
                color: '#ff4081',
                fontWeight: 700,
                fontSize: '1.35rem',
                marginBottom: 6,
            }}>{painting.name}</h2>
            <p style={{ margin: 0, color: "#888" }}>Owner: <b>{painting.ownerId}</b></p>
            <p style={{ margin: 0, color: "#888" }}>Likes: <b>{painting.likes}</b></p>
            <div style={{ margin: '18px 0' }}>{renderContent()}</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 8 ,width: '48%'}}>
                <Tooltip title="Like this painting">
                    <Button
                        type="primary"
                        icon={<LikeOutlined />}
                        onClick={handleLike}
                        style={{
                            background: 'linear-gradient(90deg, #ff4081 0%, #ff9800 100%)',
                            border: 'none',
                            fontWeight: 700,
                            boxShadow: '0 2px 12px #ffd6f0',
                            flex:1
                        }}
                    >
                        Like
                    </Button>
                </Tooltip>
                <Tooltip title="View details">
                    <Button
                        type="default"
                        icon={<ArrowRightOutlined />}
                        onClick={handleNavigate}
                        style={{
                            background: 'rgba(255,255,255,0.13)',
                            color: '#ff4081',
                            fontWeight: 700,
                            border: '2px solid #ff4081',
                            flex:1
                        }}
                    >
                        View Details
                    </Button>
                </Tooltip>
            </div>
        </GlassCard>
    );
};

export default ShowPainting;
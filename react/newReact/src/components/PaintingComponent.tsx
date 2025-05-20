import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  Spin, Button, List, Input, Form, message } from 'antd';
import { PaintingType } from '../store/paintingSlice';
import { CommentPostModel } from '../store/commentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsAsync, addCommentAsync } from '../store/commentSlice';
import { AppDispatch, StoreType } from '../store/store';
import { ESubject } from '../store/paintingSlice';
import TextFileDisplay from './TextFileDisplay';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GlassCard = styled(motion.div)`
  background: rgba(255,255,255,0.89);
  border: 2px solid ${({ theme }:{theme:any}) => theme.primary};
  border-radius: 24px;
  box-shadow: 0 8px 40px 0 rgba(60,60,170,0.09);
  margin: 30px 0;
  padding: 28px;
`;

const PaintingImg = styled(motion.img)`
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 18px;
  margin-bottom: 16px;
`;

const PaintingComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    //const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    
    const [painting, setPainting] = useState<PaintingType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState<string>('');
    
    const comments = useSelector((store: StoreType) => store.comments.comments);
    const token = useSelector((state: any) => state.user.token);
    const userId = useSelector((store: StoreType) => store.user.user.id);

    useEffect(() => {
        const fetchPainting = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_MY_API_URL}Painting/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setPainting(data);
                dispatch(fetchCommentsAsync());
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPainting();
    }, [id, dispatch]);

    const handleBack = () => {
        
        
        const backUrl = sessionStorage.getItem('lastPaintingCaller') || '/';
        sessionStorage.removeItem('lastPaintingCaller')
        navigate(backUrl);
    };

    const handleAddComment = async () => {
        if (!commentContent) {
            message.error('Comment cannot be empty');
            return;
        }
        const newComment: CommentPostModel = {
            content: commentContent,
            userId: userId,
            paintId: Number(id),
        };
        const resultAction = await dispatch(addCommentAsync({ comment: newComment, token }));
        if (addCommentAsync.fulfilled.match(resultAction)) {
            message.success('Comment added successfully!');
            setCommentContent('');
        } else {
            message.error('Failed to add comment');
        }
    };

    const renderContent = () => {
        if (!painting) return null;
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
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                );
            case 'Writing':
                return <pre><TextFileDisplay fileUrl={painting.url}/></pre>;
            default:
                return <p>Unsupported painting type.</p>;
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!painting) {
        return <div>Painting not found.</div>;
    }

    return (
        <GlassCard
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
        >
            <Button onClick={handleBack} style={{ marginBottom: 18, borderRadius: 12 }}>← Back</Button>
            <h2 style={{ color: "#ff4081", fontWeight: 700 }}>{painting.name}</h2>
            <p style={{ color: "#888" }}>Owner: <b>{painting.ownerId}</b></p>
            <div style={{ margin: '20px 0' }}>{renderContent()}</div>
            <h3>Comments</h3>
            <List
                dataSource={comments.filter(c => c.paintId === painting.id)}
                renderItem={item => (<List.Item>{item.content}</List.Item>)}
                style={{ background: "rgba(255,255,255,0.4)", borderRadius: 12, marginBottom: 16 }}
            />
            <Form
                onFinish={handleAddComment}
                style={{ display: "flex", gap: 8, marginTop: 16 }}
            >
                <Input
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ borderRadius: 12 }}
                />
                <Button type="primary" htmlType="submit" style={{
                    background: "linear-gradient(90deg, #ff4081 0%, #ff9800 100%)",
                    border: 'none',
                    fontWeight: 700
                }}>Send</Button>
            </Form>
        </GlassCard>
    );
};

export default PaintingComponent;
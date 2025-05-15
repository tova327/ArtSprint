import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Button, List, Input, Form, message } from 'antd';
import { PaintingType } from '../store/paintingSlice';
import { CommentPostModel } from '../store/commentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsAsync, addCommentAsync } from '../store/commentSlice';
import { AppDispatch, StoreType } from '../store/store';
import { ESubject } from '../store/paintingSlice'; // Import ESubject
import TextFileDisplay from './TextFileDisplay';

const PaintingComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
                const response = await fetch(`https://localhost:7001/api/Painting/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
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
        navigate(-1);
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
                    <audio controls>
                        <source src={painting.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                );
            case 'Drawing':
            case 'Photography':
            case 'Graphic':
                return <img src={painting.url} alt={painting.name} style={{ width: '100%', height: 'auto' }} />;
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
        return <div>No painting found.</div>;
    }

    return (
        <Card style={{ margin: '20px' }}>
            {renderContent()} {/* Render the correct content based on subject */}
            <h2>{painting.name}</h2>
            <p>Owner ID: {painting.ownerId}</p>
            <p>Likes: {painting.likes}</p>
            <Button onClick={handleBack}>Go Back</Button>

            <h3>Comments</h3>
            <List
                itemLayout="horizontal"
                dataSource={comments.filter(comment => comment.paintId === Number(id))}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={`User ID: ${item.userId}`}
                            description={item.content}
                        />
                        <div>{new Date(item.createdAt).toLocaleString()}</div>
                    </List.Item>
                )}
            />

            <Form style={{ marginTop: '20px' }} onFinish={handleAddComment}>
                <Form.Item>
                    <Input.TextArea
                        rows={4}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Add a comment..."
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit Comment</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PaintingComponent;

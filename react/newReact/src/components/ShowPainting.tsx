import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, message } from 'antd';
import { ArrowRightOutlined, LikeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addLikeAsync, addLikeR } from '../store/paintingSlice';
import { AppDispatch, StoreType } from '../store/store';
import { PaintingType, ESubject } from '../store/paintingSlice';

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
            dispatch(addLikeR(painting.id)); // Revert local state
            setSessionLikes(prevLikes => prevLikes - 1); // Decrement session likes
            message.error('Failed to like the painting. Please try again.');
        }
    };

    const renderContent = () => {
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
                return <pre>{painting.name} from {painting.ownerId}</pre>; // Display the text content
            default:
                return <p>Unsupported painting type.</p>;
        }
    };

    return (
        <Card style={{ margin: '20px' }}>
            <h2>{painting.name}</h2>
            <p>Owner ID: {painting.ownerId}</p>
            <p>Likes: {painting.likes}</p>
            {renderContent()}
            <div>
                <Button 
                    type="primary" 
                    icon={<LikeOutlined />} 
                    onClick={handleLike}
                >
                    Like
                </Button>
                <Button 
                    type="primary" 
                    icon={<ArrowRightOutlined />} 
                    onClick={handleNavigate}
                    style={{ marginLeft: '10px' }}
                >
                    View Details
                </Button>
            </div>
        </Card>
    );
};

export default ShowPainting;

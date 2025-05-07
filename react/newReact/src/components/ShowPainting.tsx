
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { PaintingType } from '../store/paintingSlice';



const ShowPainting = ({ painting }:{painting:PaintingType}) => {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleNavigate = () => {
        navigate(`/painting/${painting.id}`); // Adjust the route based on your routing setup
    };

    return (
        <Card style={{ margin: '20px' }}>
            <img src={painting.url} alt={painting.name} style={{ width: '100%', height: 'auto' }} />
            <h2>{painting.name}</h2>
            <p>Owner ID: {painting.ownerId}</p>
            <p>Likes: {painting.likes}</p>
            <Button 
                type="primary" 
                icon={<ArrowRightOutlined />} 
                onClick={handleNavigate}
            >
                View Details
            </Button>
        </Card>
    );
};

export default ShowPainting;

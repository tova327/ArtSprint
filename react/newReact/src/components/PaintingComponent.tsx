import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Button } from 'antd';
import { PaintingType } from '../store/paintingSlice';

const PaintingComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get painting ID from URL
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [painting, setPainting] = useState<PaintingType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPainting = async () => {
            try {
                const response = await fetch(`https://localhost:7001/api/Painting/${id}`); // Fetch painting details
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPainting(data);
            } catch (err:any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPainting();
    }, [id]);

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
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
            <img src={painting.url} alt={painting.name} style={{ width: '100%', height: 'auto' }} />
            <h2>{painting.name}</h2>
            <p>Owner ID: {painting.ownerId}</p>
            <p>Likes: {painting.likes}</p>
            <Button onClick={handleBack}>Go Back</Button> {/* Button to go back */}
        </Card>
    );
};

export default PaintingComponent;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'antd';

import { AppDispatch, StoreType } from '../store/store';
import { ESubject, fetchPaintingsAsync, PaintingType } from '../store/paintingSlice';
import ShowPainting from './ShowPainting';



const PaintingsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const paintings = useSelector((store: StoreType) => store.painting.paintings); // Adjust according to your state structure
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPaintings = async () => {
            await dispatch(fetchPaintingsAsync());

            setLoading(false);
        };

        loadPaintings();
    }, [dispatch]);
    const location = useLocation();

    // Get the subject from the query parameter
    const params = new URLSearchParams(location.search);
    const subject = params.get('subject');
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{subject} Paintings</h1>
            <Row gutter={[16, 16]}>
                {paintings.map((painting: PaintingType) => {
                    if (ESubject[painting.subject] === subject) return (
                        <Col key={painting.id} xs={24} sm={12} md={8} lg={6}>
                            <ShowPainting  painting={painting}/>
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
};

export default PaintingsPage;
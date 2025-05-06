

import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaintingsAsync } from '../store/paintingSlice';
import ShowPainting from './ShowPainting'; // Assuming this is your component
import { AppDispatch, StoreType } from '../store/store';

const ShowPaintings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const paintings = useSelector((store:StoreType) => store.painting.paintings); // Adjust according to your state structure
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPaintings = async () => {
            await dispatch(fetchPaintingsAsync());
            setLoading(false);
        };

        loadPaintings();
    }, [dispatch]);

    // const handleLike = (paintingId:number) => {
    //     dispatch(addLikeR(paintingId));
    // };

    if (loading) {
        return <div>Loading...</div>; // Simple loading state
    }

    return (
        <div>
            {paintings.map((painting) => (
                <div key={painting.id} style={{ margin: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <ShowPainting painting={painting}  />
                    
                    {/* <p>Likes: {painting.likes}</p> */}
                </div>
            ))}
        </div>
    );
};

export default ShowPaintings;

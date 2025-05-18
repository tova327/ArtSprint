import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaintingsAsync } from '../store/paintingSlice';
import ShowPainting from './ShowPainting';
import { AppDispatch, StoreType } from '../store/store';
import { motion } from 'framer-motion';

const ShowPaintings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const paintings = useSelector((store:StoreType) => store.painting.paintings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPaintings = async () => {
            await dispatch(fetchPaintingsAsync());
            setLoading(false);
        };
        loadPaintings();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
        >
            {paintings.map((painting) => (
                <motion.div
                    key={painting.id}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0 }
                    }}
                >
                    <ShowPainting painting={painting} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ShowPaintings;
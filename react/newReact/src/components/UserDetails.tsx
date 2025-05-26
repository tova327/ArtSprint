import { Descriptions, Statistic } from 'antd';
import { getAllUsersAsync, UserType } from '../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';
import { useEffect, useState } from 'react';

const UserDetails = ({ id, short }: { id: number, short: boolean }) => {
    const dispatch = useDispatch<AppDispatch>();
    const allUsers = useSelector((store: StoreType) => store.user.allusers);
    const token = useSelector((store: StoreType) => store.user.token);

    const [user, setUser] = useState<UserType | undefined>(undefined);

    useEffect(() => {
        dispatch(getAllUsersAsync({ token: token || '' }));
    }, [dispatch, token]);

    useEffect(() => {
        const u = allUsers?.find(u => u.id === id);
        setUser(u);
    }, [allUsers, id]);

    const formatCameOnDate = (date: any) => {
        // Check if date is a valid Date object or a valid date string
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleDateString() : 'N/A';
    };

    if (short) {
        return (
            <Statistic title="Owner" value={user?.name} />
        );
    }

    return (
        <Descriptions title="Owner">
            <Descriptions.Item label="Name: ">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="Email: ">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Joined As: ">{user?.cameOn && formatCameOnDate(user.cameOn)}</Descriptions.Item>
        </Descriptions>
    );
};

export default UserDetails;

import { Descriptions, Statistic } from 'antd';
import { UserType } from '../store/userSlice';
import { useSelector } from 'react-redux';
import { StoreType } from '../store/store';
import { useEffect, useState } from 'react';

const UserDetails = ({ id, short }: { id: number, short: boolean }) => {

    const allUsers = useSelector((store: StoreType) => store.user.allusers)
    const [user, setUser] = useState({} as UserType|undefined)
    useEffect(() => {
        const u = allUsers?.find(u => u.id === id)
        setUser(u)
    }, [])
    if (short)
        return (
            <Statistic title="Owner" value={user?.name} />
        )
    return (
        <Descriptions title="Owner">
            <Descriptions.Item label="Name: ">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="Email: ">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Joined As: ">{user?.cameOn?.toDateString()}</Descriptions.Item>
        </Descriptions>
    )
};
export default UserDetails
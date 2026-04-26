import { Empty } from 'antd';

export const AppEmpty = ({ description = 'אין נתונים' }) => {
  return <Empty description={description} />;
};
import { Empty } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
export const AppEmpty = ({ description = 'אין נתונים' }) => {
  return (<><FrownOutlined /><Empty image={null} description={description} /></>);
};
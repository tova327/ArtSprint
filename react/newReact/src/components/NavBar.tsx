
import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (subject: string) => {
    const params = new URLSearchParams(location.search);
    params.set('subject', subject);
    navigate({ search: params.toString() });
  };

  return (
    <Menu mode="horizontal" theme="dark">
      {['Music', 'Drawing', 'Photography', 'Graphic', 'Writing'].map((subject) => (
        <Menu.Item key={subject} onClick={() => handleMenuClick(subject)}>
          {subject}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default Navbar;
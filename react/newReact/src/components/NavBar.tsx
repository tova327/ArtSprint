import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const GlassBar = styled.div`
  background: ${({ theme }:{theme:any}) => theme.navGlass};
  border-bottom: ${({ theme }:{theme:any}) => theme.navBorder};
  backdrop-filter: blur(10px);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 2px 20px 0 rgba(60,60,170,0.07);
  padding: 0 16px;
`;

const subjects = [
  { name: 'Music', color: '#ff4081' },
  { name: 'Drawing', color: '#ff9800' },
  { name: 'Photography', color: '#56c6ff' },
  { name: 'Graphic', color: '#7a42f4' },
  { name: 'Writing', color: '#29d98c' },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (subject: string) => {
    const params = new URLSearchParams(location.search);
    params.set('subject', subject);
    navigate({ search: params.toString() });
  };

  return (
    <GlassBar >
      <Menu
        mode="horizontal"
        style={{
          background: "transparent",
          borderBottom: "none",
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: 1,
        }}
        selectable={false}
        overflowedIndicator={<></>}
      >
        {subjects.map((subject) => (
          <Menu.Item
            key={subject.name}
            onClick={() => handleMenuClick(subject.name)}
            style={{
              color: subject.color,
              background: "transparent",
              borderRadius: 16,
              margin: "0 6px",
              border: `2px solid ${subject.color}`,
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.domEvent.currentTarget.style.background = subject.color + "22")}
            onMouseLeave={e => (e.domEvent.currentTarget.style.background = "transparent")}
          >
            {subject.name}
          </Menu.Item>
        ))}
      </Menu>
    </GlassBar>
  );
};

export default Navbar;
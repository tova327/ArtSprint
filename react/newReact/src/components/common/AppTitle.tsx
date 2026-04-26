// Title.tsx
import React from 'react';
import { Typography } from 'antd';
import { themeToken } from '../../theme/token';
import { spacing } from '../../theme/constant';

const { Title: AntTitle } = Typography;

type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const AppTitle: React.FC<TitleProps> = ({ level = 1, children, style }) => {
  return (
    <AntTitle
      level={level}
      style={{
        textAlign: 'center',
       marginBottom: spacing.xl,
        color: themeToken.token?.colorPrimary,
        ...style,
      }}
    >
      {children}
    </AntTitle>
  );
};

export default AppTitle;
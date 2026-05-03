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
  props?: React.HTMLAttributes<HTMLHeadingElement>;
};

const AppTitle: React.FC<TitleProps> = ({ level = 1, children, style, props }) => {
  return (
    <AntTitle
      level={level}
      style={{
        textAlign: 'center',
       marginBottom: spacing.md,
       marginTop: 0,
       lineHeight: 1.2,
       wordBreak: "normal",
        color: themeToken.token?.colorPrimary,
        ...style,
      }}
      {...props}
    >
      {children}
    </AntTitle>
  );
};

export default AppTitle;

// Tag.tsx
import React from 'react';
import { Tag as AntTag } from 'antd';
import { themeToken } from '../../theme/token';

type TagProps = {
  color?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const AppTag: React.FC<TagProps> = ({ color, children, style }) => {
  return (
    <AntTag
      color={color || themeToken.token?.colorPrimary}
      style={{
        borderRadius: themeToken.token?.borderRadius,
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </AntTag>
  );
};

export default AppTag;
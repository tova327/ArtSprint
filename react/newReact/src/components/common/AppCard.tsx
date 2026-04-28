import React from 'react';
import { Card as AntCard, CardProps } from 'antd';
import { themeToken } from '../../theme/token';
import { colors } from '../../theme/colors';

interface AppCardProps extends CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const AppCard: React.FC<AppCardProps> = ({ children, style, ...props }) => {
  return (
    <AntCard
      {...props}
      style={{
        backgroundColor: colors.bgBase,
        borderRadius: themeToken.components?.Card?.borderRadiusLG,
        boxShadow: themeToken.components?.Card?.boxShadow,
        border: `1px solid ${colors.border}`,
        ...style,
      }}
    >
      {children}
    </AntCard>
  );
};

export default AppCard;
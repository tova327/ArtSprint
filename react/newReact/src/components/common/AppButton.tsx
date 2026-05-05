// Button.tsx
import React from 'react';
import { Button as AntButton } from 'antd';
import { themeToken } from '../../theme/token';

type ButtonProps = {
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  onClick?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  style?: React.CSSProperties;
  htmlType?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode|null;
};

const AppButton: React.FC<ButtonProps> = ({ type = 'primary', onClick, children, loading, style ,htmlType, disabled,icon}) => {
  return (
    <AntButton
      type={type}
      onClick={onClick}
      loading={loading}
      style={{
        height: themeToken.token?.controlHeight,
        fontWeight: 500,
        ...style,
      }}
      htmlType={htmlType}
      disabled={disabled}
      icon={icon}
    >
      {children}
    </AntButton>
  );
};

export default AppButton;
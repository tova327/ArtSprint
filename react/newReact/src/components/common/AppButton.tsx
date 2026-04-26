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
};

const Button: React.FC<ButtonProps> = ({ type = 'primary', onClick, children, loading, style ,htmlType, disabled}) => {
  return (
    <AntButton
      type={type}
      onClick={onClick}
      loading={loading}
      style={{
        borderRadius: themeToken.token?.borderRadius,
        height: themeToken.token?.controlHeight,
        fontWeight: 500,
        ...style,
      }}
      htmlType={htmlType}
      disabled={disabled}
    >
      {children}
    </AntButton>
  );
};

export default Button;
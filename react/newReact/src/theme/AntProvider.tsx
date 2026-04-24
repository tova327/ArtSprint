// theme/AntProvider.tsx
import React from 'react';
import { ConfigProvider } from 'antd';
import { themeToken } from './token';

type Props = {
  children: React.ReactNode;
};

export const AntProvider: React.FC<Props> = ({ children }) => {
  return (
    <ConfigProvider
      theme={themeToken}
    >
      {children}
    </ConfigProvider>
  );
};
// theme/AntProvider.tsx
import React from 'react';
import { App, ConfigProvider } from 'antd';
import { themeToken } from './token';

type Props = {
  children: React.ReactNode;
};



export const AntProvider = ({ children }:Props) => {
  return (
    <ConfigProvider theme={themeToken}>
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
};
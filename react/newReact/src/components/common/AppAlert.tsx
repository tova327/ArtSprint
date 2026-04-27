import { Alert } from 'antd';
import { useEffect, useState } from 'react';
export type AlertType = { type: 'success' | 'error' | 'warning' | 'info'; message: string; isVisible?: boolean };

export const AppAlert = ({ type, message, isVisible }: AlertType) => {
  

  

  return (
    <>
      {isVisible && <Alert type={type} message={message} showIcon />}
    </>
  );
};

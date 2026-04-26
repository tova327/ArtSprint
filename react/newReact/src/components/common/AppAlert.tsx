import { Alert } from 'antd';
export type AlertType = { type: 'success' | 'error' | 'warning' | 'info'; message: string; isVisible: boolean };

export const AppAlert = ({ type, message, isVisible }: AlertType) => {
  return (
    <>
      {isVisible && <Alert type={type} message={message} showIcon />}
    </>
  );
};

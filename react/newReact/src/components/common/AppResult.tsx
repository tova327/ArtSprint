import { Result, Button } from 'antd';

type ResultStatusType = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500' | undefined;

export const AppResult = ({ status, title, onAction }: { status: ResultStatusType; title: string; onAction: () => void }) => {
  return (
    <Result
      status={status}
      title={title}
      extra={<Button type="primary" onClick={onAction}>OK</Button>}
    />
  );
};
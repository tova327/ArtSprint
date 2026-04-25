import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';


  const [api, _] = notification.useNotification();

  const openNotification = (type: NotificationType, title: string, description: string) => {
    api[type]({
      message: title,
      description,
    });
  };
  export default openNotification;




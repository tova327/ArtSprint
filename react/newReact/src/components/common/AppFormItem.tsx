import { Form } from "antd";

const AppFormItem = (props: React.ComponentProps<typeof Form.Item>) => {
  return <Form.Item {...props} />;
};

export default AppFormItem;
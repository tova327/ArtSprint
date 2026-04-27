import { Form } from "antd";

const AppForm = (props: React.ComponentProps<typeof Form>) => {
  return <Form layout="vertical"{...props} />;
};

export default AppForm;
///////////
AppForm.useForm = Form.useForm;
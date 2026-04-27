import { Input } from "antd";

const AppInput = ({ ...props }) => {
  if (props?.type === "password") {
    return <Input.Password {...props} />;
  }

  return <Input {...props} />;
};
export default AppInput;
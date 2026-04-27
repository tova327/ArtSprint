import React from "react";
import { Checkbox, CheckboxProps } from "antd";

type AppCheckboxProps = CheckboxProps & {
  label?: React.ReactNode;
};

export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  label,
  children,
  ...props
}) => {
  return <Checkbox {...props}>{label || children}</Checkbox>;
};
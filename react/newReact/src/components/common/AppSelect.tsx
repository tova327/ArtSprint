// AppSelect.tsx

import React from "react"
import { Select } from "antd"

type OptionType = {
  label: string
  value: string | number
}

type Props = {
  options: OptionType[]
  placeholder?: string
  value?: string | number
  onChange?: (value: any) => void
}

const AppSelect: React.FC<Props> = ({
  options,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      style={{ width: "100%", position: "relative" ,zIndex: 999, top: 0}}
    />
  )
}

export default AppSelect
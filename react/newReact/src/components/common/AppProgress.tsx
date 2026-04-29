// AppProgress.tsx

import React from "react"
import { Progress } from "antd"

type Props = {
  percent: number
}

const AppProgress: React.FC<Props> = ({ percent }) => {
  return (
    <Progress
      percent={Math.round(percent)}
      status={percent === 100 ? "success" : "active"}
    />
  )
}

export default AppProgress
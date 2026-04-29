import { Flex } from "antd"
import { ReactNode } from "react"
import { spacing } from "../../theme/constant"

type Props = {
   children: ReactNode
   style?: React.CSSProperties
}

const AppSection = ({ children, style }: Props) => (
   <Flex vertical gap={spacing.md} style={style}>
      {children}
   </Flex>
)
export default AppSection
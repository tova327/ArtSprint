import { Flex } from "antd"
import { ReactNode } from "react"
import { spacing } from "../../theme/constant"

type Props = {
   children: ReactNode
}

const AppSection = ({ children }: Props) => (
   <Flex vertical gap={spacing.md}>
      {children}
   </Flex>
)
export default AppSection
import { Typography } from 'antd';
import { spacing } from '../../theme/constant';
import { themeToken } from '../../theme/token';

const { Text, Paragraph } = Typography;


export const AppParagraph = ({ children }: { children: string }) => {
  return <Paragraph style={{marginBottom: spacing.md, color: themeToken?.token?.colorTextSecondary}}>{children}</Paragraph>;
};

export const AppCaption = ({ children }: { children: string }) => {
  return <Text type="secondary" style={{ fontSize: 12 }}>{children}</Text>;
};
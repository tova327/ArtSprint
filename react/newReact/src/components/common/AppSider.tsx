import Sider from "antd/es/layout/Sider"
import { themeToken } from "../../theme/token"

const AppSider = ({ style, children ,collapsed,toggleCollapsed}:{ style?: React.CSSProperties; children?: React.ReactNode; collapsed?: boolean; toggleCollapsed?: () => void }) => {
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
        minHeight: "100%", borderRight: themeToken.token?.colorBorder, flex: "0 0 260px", maxWidth: "20%", minWidth: "20%"
    };

    return (
        <Sider
            width={260}
            style={{ ...siderStyle, ...style }}
            collapsed={collapsed} collapsible onCollapse={toggleCollapsed}
        >
            {children}
        </Sider>
    )
}
export default AppSider
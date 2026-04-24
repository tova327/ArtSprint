// theme/token.ts
import type { ThemeConfig } from 'antd';
import { colors } from './colors';

export const themeToken: ThemeConfig = {
  token: {
    // 🎨 Core colors
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,

    // 🧱 Backgrounds
    colorBgBase: colors.bgBase,
    colorBgLayout: colors.bgLayout,
    colorBgContainer: colors.surface,

    // 📝 Text
    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    colorTextDisabled: colors.textDisabled,

    // 📏 Borders
    colorBorder: colors.border,
    colorSplit: colors.divider,

    // 🔲 Shape
    borderRadius: 10,

    // 🔤 Typography
    fontFamily: `'Inter', 'Rubik', system-ui, -apple-system, sans-serif`,
    fontSize: 14,

    // 📐 Control sizes
    controlHeight: 40,

    // 🌫️ Shadows (soft, modern)
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },

  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 500,
    },

    Card: {
      borderRadiusLG: 12,
      boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
    },

    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },

    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },

    Layout: {
      headerBg: colors.surface,
      bodyBg: colors.bgLayout,
    },
  },
};
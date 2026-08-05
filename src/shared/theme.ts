const colors = {
  primary: '#4374E6',
  primarySoft: 'rgba(67, 116, 230, 0.12)',
  primaryHover: 'rgba(67, 116, 230, 0.08)',
  primaryActive: 'rgba(67, 116, 230, 0.18)',
};

export const theme = {
  token: {
    colorPrimary: colors.primary,
    colorInfo: '#1677ff',
    colorTextBase: '#292929',
    sizeStep: 3,
    borderRadius: 16,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: colors.primary,
      triggerBg: colors.primary,
      headerPadding: '0px 30px',
      lightSiderBg: '#f7f9fc',
    },
    Menu: {
      darkItemBg: colors.primary,
      darkItemSelectedBg: colors.primary,
      itemBorderRadius: 22,
      itemMarginInline: 10,
      itemMarginBlock: 8,
      itemHeight: 42,
      itemPaddingInline: 14,
      itemColor: '#4b5563',
      itemHoverColor: colors.primary,
      itemHoverBg: colors.primaryHover,
      itemSelectedColor: colors.primary,
      itemSelectedBg: colors.primarySoft,
      itemActiveBg: colors.primaryActive,
      activeBarBorderWidth: 0,
      itemBg: '#fff',
    },
  },
};

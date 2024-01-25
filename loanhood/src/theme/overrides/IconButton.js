// ----------------------------------------------------------------------

export default function IconButton(theme) {
  return {
    MuiIconButton: {
      colorPrimary: {
        color: 'default',
        '&:hover': { backgroundColor: theme.palette.action.hover }
      },
      colorInherit: {
        color: 'default',
        '&:hover': { backgroundColor: theme.palette.action.hover }
      }
    }
  }
}

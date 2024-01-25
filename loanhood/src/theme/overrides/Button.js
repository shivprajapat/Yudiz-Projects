// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      root: {
        '&:hover': {
          boxShadow: 'none'
        }
      },
      sizeLarge: {
        height: 48
      },
      contained: {
        color: theme.palette.grey[800],
        boxShadow: theme.customShadows.z8,
        '&:hover': {
          backgroundColor: theme.palette.grey[400]
        }
      },
      containedPrimary: {
        boxShadow: theme.customShadows.primary
      },
      containedSecondary: {
        boxShadow: theme.customShadows.secondary
      },
      outlined: {
        border: `1px solid ${theme.palette.grey[500_32]}`,
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        }
      },
      text: {
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        }
      }
    }
  }
}

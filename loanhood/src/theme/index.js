import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
// material
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
//
import shape from './shape'
import palette from './palette'
import typography from './typography'
import breakpoints from './breakpoints'
import GlobalStyles from './globalStyles'
import componentsOverride from './overrides'
import shadows, { customShadows } from './shadows'

ThemeConfig.propTypes = {
  children: PropTypes.node
}

export default function ThemeConfig({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      breakpoints,
      shadows,
      customShadows
    }),
    []
  )
  const theme = createMuiTheme(themeOptions)
  theme.overrides = componentsOverride(theme)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}

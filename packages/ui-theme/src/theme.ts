import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import {
  theme as baseTheme,
  withThemeColors,
  /* withThemeColors */
} from '@saas-ui-pro/react'

// import { theme as glassTheme } from '@saas-ui-pro/theme-glass'
import { components } from './components'
import semanticTokens from './foundations/semantic-tokens'

// import colorScheme from './color-schemes/galaxy'
import colorScheme from './color-schemes/earth'

export const theme = extendTheme(
  {
    semanticTokens,
    components,
  },
  /**
   * Uncomment this to use any of the built-in color schemes.
   */
  // withDefaultColorScheme({ colorScheme: 'green' }),
  withThemeColors(colorScheme),
  // glassTheme,
  baseTheme,
)

import { DarkTheme, DefaultTheme, useTheme as useNavTheme } from "@react-navigation/native"
import { createContext, useCallback, useContext, useState } from "react"
import { Alert, useColorScheme } from "react-native"

// This supports "light" and "dark" themes by default. If undefined, it'll use the system theme
export type Themes = "light" | "dark" | undefined

export type ThemedStyle<T> = T & {
  light: T
  dark: T
}

type ThemeContextType = {
  theme: Themes
  setThemeOverride: (newTheme: Themes) => void
}

// create a React context and provider for the current theme
export const ThemeContext = createContext<ThemeContextType>({
  theme: undefined, // default to the system theme
  setThemeOverride: (newTheme: Themes) => {
    Alert.alert("setThemeOverride not implemented")
  },
})

export const useThemeProvider = (initialTheme: Themes = undefined) => {
  const colorScheme = useColorScheme()
  const [overridetheme, setTheme] = useState<Themes>(initialTheme)

  const setThemeOverride = useCallback((newTheme: Themes) => {
    setTheme(newTheme)
  }, [])

  console.log("useThemeProvider", { colorScheme, initialTheme, overridetheme })

  const theme = overridetheme || colorScheme || "light"
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme

  return { theme, navigationTheme, setThemeOverride, ThemeProvider: ThemeContext.Provider }
}

export const useAppTheme = () => {
  const navTheme = useNavTheme()
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  const { theme: overridetheme, setThemeOverride } = context

  const theme: Themes = overridetheme || (navTheme.dark ? "dark" : "light")

  const themed = useCallback(
    function <T>(style: ThemedStyle<T>) {
      const { light, dark, ...styleWithoutLightDark } = style

      const themeStyle = theme ? style[theme] : undefined

      return [styleWithoutLightDark, themeStyle]
    },
    [theme],
  )

  return { theme, themed, navTheme, setThemeOverride }
}

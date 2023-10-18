import "./theme.css";

function cssValue(property) {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}

export default function HOTTheme() {
  const colors = {
    primary: cssValue("--hottheme-color-primary"),
    primary: cssValue("--hottheme-color-primary-fg"),
    secondary: cssValue("--hottheme-color-secondary"),
    "text-primary": cssValue("--hottheme-color-text-primary"),
    "text-secondary": cssValue("--hottheme-color-text-secondary"),
    divider: cssValue("--hottheme-color-divider"),
    warning: cssValue("--hottheme-color-warning"),
    "warning-fg": cssValue("--hottheme-color-warning-fg"),
    error: cssValue("--hottheme-color-error"),
    "error-fg": cssValue("--hottheme-color-error-fg"),
    white: cssValue("--hottheme-color-white"),
    valid: cssValue("--hottheme-color-valid"),
    "valid-fg": cssValue("--hottheme-color-valid-fg"),
    dark: cssValue("--hottheme-color-dark"),
  };

  return {
    colors,
    map: {
      waysLine: {
        "line-width": 2,
      },
      nodesSymbol: {},
    },
  };
}

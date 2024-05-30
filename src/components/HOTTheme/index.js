function cssValue(property) {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}

export default function HOTTheme() {
  const colors = {
    primary: cssValue("--hot-primary"),
    secondary: cssValue("--hot-secondary"),
    info: cssValue("--hot-info"),
    error: cssValue("--hot-error"),
    warning: cssValue("--hot-warning"),
    success: cssValue("--hot-success"),
    white: cssValue("--hot-white"),
    black: cssValue("--hot-black"),
  };

  return {
    colors,
    map: {
      waysLine: {
        "line-width": 2,
      },
      nodes: {
        "circle-color": "#D63F40",
        "circle-radius": 7,
      },
    },
  };
}

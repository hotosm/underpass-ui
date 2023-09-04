# Underpass UI

A set of UI components for Underpass.

## Install

```sh
yarn add https://github.com/hotosm/underpass-ui.git
```

## Usage

```jsx
<UnderpassMap
  center={[-79.64696, 0.95953]}
  tagKey="building"
  tagValue="yes"
  highlightDataQualityIssues
  grayscale
/>
```

See the examples folder for more.

## Configure

The default URL for the Underpass REST API is `http://underpass.live:8000` (an Underpass development server), but you can change it using an environment variable:

```sh
export REACT_APP_UNDERPASS_API=http:://localhost:8000
```



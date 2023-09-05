# Underpass UI

A set of UI components for Underpass.

## Install

```sh
yarn add https://github.com/hotosm/underpass-ui.git
```

## Usage

Include the styles file on your project:

```js
import "@hotosm/underpass-ui/dist/index.css"``
```

And use the components:

```jsx
<UnderpassMap
  center={[-79.64696, 0.95953]}
  tagKey="building"
  tagValue="yes"
  highlightDataQualityIssues
  grayscale
/>
```

See the `playground` folder for more examples.

## Configure

The default URL for the Underpass REST API is `http://underpass.live:8000` (an Underpass development server), but you can change it using an environment variable:

```sh
export REACT_APP_UNDERPASS_API=http:://localhost:8000
```

import React, { Component } from 'react';
import './App.css';
import "@hotosm/underpass-ui-dev/dist/index.css"
import { LiveQualityMonitor, UnderpassMap } from '@hotosm/underpass-ui-dev'

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="section2">
          <UnderpassMap
            center={[0.95953, -79.64696].reverse()}
            tagKey="building"
            tagValue="yes"
            highlightDataQualityIssues
            grayscale
          />
        </div>
        <div className="section1">
          <LiveQualityMonitor
            tagKey="amenity"
            tagValue=""
            page={1}
          />
        </div>
      </div>
    );
  }
}

export default App;

import React from 'react';
import './styles.css';
import FeatureDetailCard from '../FeatureDetailCard';

const features = [
  {
    id: '327848392',
    timestamp: '6 minutes ago',
    buildingType: 'yes',
    status: 'Un-squared',
    comments: ['#hotosm-project-14262', '#MappingEcuador'],
  },
  {
    id: '372848392',
    timestamp: '8 minutes ago',
    buildingType: 'house',
    comments: ['#hotosm-project-14262'],
  },
  {
    id: '327488392',
    timestamp: '12 minutes ago',
    buildingType: 'yes',
    status: 'Overlapping',
    comments: ['#hotosm-project-14262', '#MappingEcuador'],
  },
];

function LiveQualityMonitor() {
  return (
    <div className='feature-cards-ctr'>
      {features.map((feature) => (
        <FeatureDetailCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

export default LiveQualityMonitor;

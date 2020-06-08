import React from 'react';
import { Spin } from 'antd';
import CenterAligner from './CenterAligner';

const LoadWrapper: React.FC = () => {
  return (
    <CenterAligner>
      <Spin size="large" />
    </CenterAligner>
  );
};

export default LoadWrapper;

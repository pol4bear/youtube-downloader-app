import React from 'react';
import styled from 'styled-components';

interface CenterAlignerProps {
  children?: React.ReactNode;
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const CenterAligner: React.FC<CenterAlignerProps> = (props) => {
  const { children } = props;
  return <Wrapper>{children}</Wrapper>;
};

export default CenterAligner;

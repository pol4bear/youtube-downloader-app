import React from 'react';
import NotFound from './NotFound';
import NotAvailable from './NotAvailable';

interface ErrorContentProps {
  error: number;
}

const ErrorContent: React.FC<ErrorContentProps> = ({ error }) => {
  switch (error) {
    case 3:
      return <NotFound />;
    default:
      return <NotAvailable />;
  }
};

export default ErrorContent;

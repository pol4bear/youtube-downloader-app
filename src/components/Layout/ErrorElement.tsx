import React from 'react';
import NotFound from './NotFound';
import NotAvailable from './NotAvailable';

interface ErrorElementProps {
  error: number;
}

const ErrorElement: React.FC<ErrorElementProps> = ({ error }) => {
  switch (error) {
    case 3:
      return <NotFound />;
    default:
      return <NotAvailable />;
  }
};

export default ErrorElement;

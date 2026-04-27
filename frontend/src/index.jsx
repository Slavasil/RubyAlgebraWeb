import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PolynomialPanel from './PolynomialPanel';

const root = createRoot(document.getElementById('root'));
root.render(<PolynomialPanel />);

import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Layout } from './components/layout/layout';
import { StyledEngineProvider } from '@mui/material/styles';

function App() {
  return (
    <div className='app-styles'>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <Layout />
        </StyledEngineProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

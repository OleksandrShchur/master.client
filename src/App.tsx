import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Layout } from './components/layout/layout';

function App() {
  return (
    <div className='app-styles'>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from 'react';
import { Sidebar } from '../sidebar/sidebar';
import { SecondOrder } from '../differentialSecondOrder/secondOrder';
import {
    Routes,
    Route,
  } from "react-router-dom";
import './layout.css';

export const Layout: React.FC = () => {
    return (
        <div className='order'>
            <Sidebar />
            <Routes>
                <Route path="/" element={<SecondOrder />} />
                <Route path="/equation-with-delay" element={<SecondOrder />} />
                <Route path="/first-order" element={<SecondOrder />} />
                <Route path="/second-order" element={<SecondOrder />} />
            </Routes>
        </div>
    )
}
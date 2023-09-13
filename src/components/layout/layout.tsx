import React from 'react';
import { Sidebar } from '../sidebar/sidebar';
import { SecondOrder } from '../differentialSecondOrder/secondOrder';
import './layout.css';

export const Layout: React.FC = () => {
    return (
        <div className='order'>
            <Sidebar />
            <SecondOrder />
        </div>
    )
}
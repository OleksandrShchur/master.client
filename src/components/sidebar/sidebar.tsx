import React from 'react';

import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import './sidebar.css';

export const Sidebar: React.FC = () => {
    return (
      <div className='sidebar'>
        <Navigation
            // you can use your own router's api to get pathname
            activeItemId="/equation-with-delay"
            onSelect={({itemId}) => {
              // maybe push to the route
            }}
            items={[
              {
                title: 'Диференціально-різницеве рівняння із запізненням',
                itemId: '/equation-with-delay'
              },
              // {
              //   title: 'Диференціальне рівняння 1-го порядку',
              //   itemId: '/first-order'
              // },
              // {
              //   title: 'Диференціальне рівняння 2-го порядку',
              //   itemId: '/second-order'
              // }
            ]}
          />
      </div>
    );
}

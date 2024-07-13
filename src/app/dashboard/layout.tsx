import React, { ReactNode } from 'react';
import Header from './_components/Header';
interface DashboardLayoutProps {
    children: ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div>
            <Header/>
            <div className='mx-5 md:mx-20 lg:mx-32'>
            {children}
            </div>
        </div>
    );
};

export default DashboardLayout;

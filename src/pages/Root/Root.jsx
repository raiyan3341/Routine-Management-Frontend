import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 

const Root = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Root;
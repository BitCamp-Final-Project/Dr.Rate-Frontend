/* src/layouts/UserLayout.jsx */

import { Outlet } from 'react-router-dom';
import Header from 'src/components/Header/Header';
import Footer from 'src/components/Footer/Footer';

const UserLayout = () => {
    return (
        <>
            <Header />
                <Outlet />
            <Footer />
        </>
    );
};

export default UserLayout;

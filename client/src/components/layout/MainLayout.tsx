import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function MainLayout() {
    const location = useLocation();
    const hideHeaderFooter = ['/login', '/register'];
    const shouldHide = hideHeaderFooter.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {!shouldHide && <Navbar />}
            <main className="flex-grow">
                <Outlet />
            </main>
            {!shouldHide && <Footer />}
        </div>
    );
}

export default MainLayout;

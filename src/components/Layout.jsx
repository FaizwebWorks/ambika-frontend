import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => (
  <div className="flex flex-col min-h-screen w-full">
    <Navbar />
    {/* Added pt-20 to account for fixed navbar height */}
    <main className="flex-1 flex pt-20 bg-white w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
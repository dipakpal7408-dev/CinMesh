import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

const AppLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  </div>
);

export default AppLayout;

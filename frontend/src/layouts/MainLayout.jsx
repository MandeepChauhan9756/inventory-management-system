import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;

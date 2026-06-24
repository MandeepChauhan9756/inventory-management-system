import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="sidebar">
      <h2>Inventory</h2>

      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/customers">Customers</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>

        <li>
          <Link to="/orders/create">Create Order</Link>
        </li>
      </ul>

      <div className="user-info">
        <p>{user?.username}</p>
        <small>{user?.role}</small>
      </div>
    </div>
  );
};

export default Sidebar;

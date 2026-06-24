import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getDashboardStats } from "../../services/dashboardService";
import DashboardChart from "../../components/charts/DashboardChart";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">
          📊 Inventory Dashboard
        </h1>

        {!stats ? (
          <div className="loading">Loading Dashboard...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card products">
                <h3>📦 Products</h3>
                <p>{stats.total_products}</p>
              </div>

              <div className="stat-card customers">
                <h3>👤 Customers</h3>
                <p>{stats.total_customers}</p>
              </div>

              <div className="stat-card orders">
                <h3>🧾 Orders</h3>
                <p>{stats.total_orders}</p>
              </div>

              <div className="stat-card revenue">
                <h3>💰 Revenue</h3>
                <p>₹{stats.total_revenue}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-section">
              <h2>Sales Analytics</h2>
              <DashboardChart stats={stats} />
            </div>

            {/* Low Stock */}
            <div className="low-stock-section">
              <h2>⚠️ Low Stock Products</h2>

              {stats.low_stock?.length === 0 ? (
                <p>No low stock products.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.low_stock?.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
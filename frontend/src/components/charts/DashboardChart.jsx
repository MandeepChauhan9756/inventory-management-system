import { 
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardChart = ({ stats }) => {
    const data = {
        labels: [
            "Products",
            "Customers",
            "Orders",
            "Revenue"
        ],
        datasets: [
            {
                label: "Count",
                data: [
                    stats.total_products,
                    stats.total_customers,
                    stats.total_orders,
                    stats.total_revenue
                ]
            }
        ]
    };

    return <Bar data={data} />;
};

export default DashboardChart;
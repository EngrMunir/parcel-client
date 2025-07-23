
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { useGetDashboardStatsQuery } from "../../../redux/features/dashboard/dashboard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const DashboardAnalytics = () => {
  const { data, isLoading } = useGetDashboardStatsQuery(undefined);

  if (isLoading) return <div className="p-6">Loading...</div>;

  const stats = data?.data;

  const pieData = {
    labels: Object.keys(stats.statusCounts || {}),
    datasets: [
      {
        data: Object.values(stats.statusCounts || {}),
        backgroundColor: ["#34D399", "#FBBF24", "#F87171"], // green, yellow, red
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: stats.last7DaysParcels.map((item: any) => item.date),
    datasets: [
      {
        label: "Parcels",
        data: stats.last7DaysParcels.map((item: any) => item.count),
        fill: false,
        borderColor: "#3B82F6",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">📊 Dashboard Analytics</h2>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-600">Total Parcels</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalParcels}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-600">Today’s Parcels</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.todayParcels}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-600">Total Customers</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-gray-600">Total Agents</h3>
          <p className="text-2xl font-bold text-orange-500">{stats.totalAgents}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-lg font-semibold mb-4">Parcel Status</h4>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4 className="text-lg font-semibold mb-4">Last 7 Days Trend</h4>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;

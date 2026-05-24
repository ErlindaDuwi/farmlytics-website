import { useNavigate, useLocation, Outlet } from "react-router-dom";

import {
  Users as UsersIcon,
  Leaf,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
);

export default function Dashboard({ setIsLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const panenData = [100, 200, 150, 300, 250, 400, 500];
  const gagalData = [20, 50, 40, 60, 30, 80, 70];
  const lahanData = [
    { nama: "Lahan A", total: 300 },
    { nama: "Lahan B", total: 250 },
    { nama: "Lahan C", total: 200 },
    { nama: "Lahan D", total: 150 },
  ];

  const targetPanen = 1000;

  const totalPanen = panenData.reduce((a, b) => a + b, 0);
  const totalGagal = gagalData.reduce((a, b) => a + b, 0);

  const progress = Math.min((totalPanen / targetPanen) * 100, 100).toFixed(0);

  const last = panenData[panenData.length - 1];
  const prev = panenData[panenData.length - 2];
  const trend = (((last - prev) / prev) * 100).toFixed(0);

  const topLahan = [...lahanData].sort((a, b) => b.total - a.total).slice(0, 3);

  const getInsight = () => {
    let insights = [];

    if (last > prev) {
      insights.push("📈 Panen meningkat dari bulan lalu");
    } else {
      insights.push("⚠️ Panen menurun dari bulan lalu");
    }

    if (totalGagal > totalPanen * 0.2) {
      insights.push("⚠️ Tingkat gagal cukup tinggi");
    }

    insights.push(`🌱 ${topLahan[0].nama} paling produktif`);

    return insights;
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    setIsLogin(false);
    navigate("/");
  };

  const DashboardHome = () => {
    const chartData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"],
      datasets: [
        {
          label: "Panen",
          data: panenData,
          fill: true,
          backgroundColor: "rgba(139, 195, 70, 0.2)",
          borderColor: "#8BC346",
          tension: 0.4,
        },
        {
          label: "Gagal",
          data: gagalData,
          fill: true,
          backgroundColor: "rgba(255,0,0,0.1)",
          borderColor: "#ef4444",
          tension: 0.4,
        },
      ],
    };

    return (
      <>
        <div className="grid grid-cols-4 gap-5">
          <Card title="Total User" value="120" icon={<UsersIcon />} />
          <Card
            title="Total Panen"
            value={totalPanen + " Kg"}
            icon={<Leaf />}
          />
          <Card title="Trend Panen" value={trend + "%"} icon={<TrendingUp />} />
          <Card title="Gagal Panen" value={totalGagal} icon={<AlertCircle />} />
        </div>

        <div className="grid grid-cols-3 gap-5 mt-6">
          <div className="col-span-2 bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-gray-600">
              Statistik Panen
            </h2>
            <div className="h-72">
              <Line data={chartData} />
            </div>
          </div>

          <div className="bg-yellow-100 p-4 rounded-xl shadow">
            <h2 className="font-semibold text-yellow-800 mb-2">Insight</h2>
            <ul className="text-sm text-yellow-700 space-y-1">
              {getInsight().map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Top Lahan</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              {topLahan.map((l, i) => (
                <li key={i}>
                  {i + 1}. {l.nama} - {l.total} Kg
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Aktivitas Terbaru</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✔️ Admin menambah data panen</li>
              <li>👤 User baru terdaftar</li>
              <li>📝 Data lahan diperbarui</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Target Panen</h2>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#8BC346] h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-sm mt-2 text-gray-600">
              {progress}% dari target tercapai
            </p>
          </div>
        </div>
      </>
    );
  };

  const isDashboardHome = location.pathname === "/dashboard";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 text-white flex flex-col h-screen bg-gradient-to-b from-[#8BC346] to-green-700">
        <div className="h-16 flex items-center px-6 border-b border-white">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Leaf size={26} />
            Farmlytics
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Menu
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />
          <Menu
            label="Users"
            active={location.pathname === "/dashboard/users"}
            onClick={() => navigate("/dashboard/users")}
          />
          <Menu
            label="Master Data"
            active={location.pathname === "/dashboard/master-data"}
            onClick={() => navigate("/dashboard/master-data")}
          />
          <Menu
            label="Audit Log"
            active={location.pathname === "/dashboard/audit-log"}
            onClick={() => navigate("/dashboard/audit-log")}
          />
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 transition p-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <div className="bg-white px-6 h-16 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold text-gray-600 capitalize">
            {location.pathname === "/dashboard" && "Dashboard"}
            {location.pathname.includes("users") && "Users"}
            {location.pathname.includes("master-data") && "Master Data"}
            {location.pathname.includes("audit-log") && "Audit Log"}
          </h2>

          <span className="text-gray-700 font-medium">Halo, Admin 👋</span>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-auto">
          {isDashboardHome ? <DashboardHome /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}

/* COMPONENT */
const Menu = ({ label, onClick, active }) => (
  <div
    onClick={onClick}
    className={`p-3 rounded-lg cursor-pointer transition
    ${
      active
        ? "bg-white text-green-700 font-semibold shadow"
        : "hover:bg-green-600 hover:scale-[1.02]"
    }`}
  >
    {label}
  </div>
);

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition flex justify-between items-center border-l-4 border-[#8BC346]">
    <div>
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-2xl font-bold text-[#8BC346] mt-1">{value}</p>
    </div>

    <div className="bg-green-100 p-2 rounded-full text-[#8BC346]">{icon}</div>
  </div>
);

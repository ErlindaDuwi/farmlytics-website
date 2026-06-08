import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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
  Legend
);

const USERS_API = "http://10.220.97.182:5000/api/users";
const HISTORY_API = "http://10.220.97.182:5000/history";
const AUDIT_API = "http://10.220.97.182:5000/audit-log";

export default function Dashboard({ setIsLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
  const loginStatus =
    localStorage.getItem("login");

  if (loginStatus !== "true") {
    navigate("/", { replace: true });
    return;
  }

  loadData();

  const loginUser =
    localStorage.getItem("username");

  setUsername(loginUser || "Admin");
}, [navigate]);

  const loadData = async () => {
    try {
      const [userRes, historyRes, auditRes] = await Promise.all([
        axios.get(USERS_API),
        axios.get(HISTORY_API),
        axios.get(AUDIT_API),
      ]);

      setUsers(userRes.data || []);
      setHistoryData(historyRes.data || []);
      setAuditLogs(auditRes.data || []);
      
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

const gagalData = historyData.map(
  (item) => Number(item.gagal || 0)
);

const totalGagal = gagalData.reduce(
  (a, b) => a + b,
  0
);

// TOTAL MASUK (sama seperti Flutter getTotalMasukSupervisor)
const totalMasuk = historyData.reduce(
  (total, item) => {
    const jenis = (
      item.jenis_transaksi || "masuk"
    )
      .toString()
      .toLowerCase();

    if (jenis !== "masuk") return total;

    const berat = Number(item.berat || 0);

    const satuan = (
      item.satuan || "kg"
    )
      .toString()
      .trim()
      .toLowerCase();

    const nilai =
      satuan === "ton"
        ? berat * 1000
        : berat;

    return total + nilai;
  },
  0
);

// TOTAL KELUAR (sama seperti Flutter getTotalKeluarSupervisor)
const stokKeluar = historyData.reduce(
  (total, item) => {
    const jenis = (
      item.jenis_transaksi || "masuk"
    )
      .toString()
      .toLowerCase();

    if (jenis !== "keluar") return total;

    const berat = Number(item.berat || 0);

    const satuan = (
      item.satuan || "kg"
    )
      .toString()
      .trim()
      .toLowerCase();

    const nilai =
      satuan === "ton"
        ? berat * 1000
        : berat;

    return total + nilai;
  },
  0
);

// SISA STOK 
const sisaStok = historyData.reduce(
  (total, item) => {
    const berat = Number(item.berat || 0);

    const satuan = (
      item.satuan || "kg"
    )
      .toString()
      .trim()
      .toLowerCase();

    const nilai =
      satuan === "ton"
        ? berat * 1000
        : berat;

    const jenis = (
      item.jenis_transaksi || "masuk"
    )
      .toString()
      .toLowerCase();

    return jenis === "keluar"
      ? total - nilai
      : total + nilai;
  },
  0
);

// Data grafik panen
const panenData = historyData
  .filter(
    (item) =>
      (
        item.jenis_transaksi || "masuk"
      ).toLowerCase() === "masuk"
  )
  .map((item) => {
    const berat = Number(item.berat || 0);

    const satuan = (
      item.satuan || "kg"
    )
      .toString()
      .trim()
      .toLowerCase();

    return satuan === "ton"
      ? berat * 1000
      : berat;
  });

  const lokasiMap = {};

  historyData.forEach((item) => {
    if (!lokasiMap[item.lokasi]) {
      lokasiMap[item.lokasi] = 0;
    }

    const berat = Number(item.berat || 0);
    const satuan = (
      item.satuan || "kg"
    )
      .toString()
      .trim()
      .toLowerCase();

    lokasiMap[item.lokasi] +=
      satuan === "ton"
        ? berat * 1000
        : berat;
      });

  const lahanData = Object.entries(lokasiMap).map(
    ([nama, total]) => ({
      nama,
      total,
    })
  );

  const topLahan = [...lahanData]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const gradeMap = {};

historyData.forEach((item) => {
  const grade = item.grade || "-";

  if (!gradeMap[grade]) {
    gradeMap[grade] = 0;
  }

  const berat = Number(item.berat || 0);

  const satuan = (
    item.satuan || "kg"
  )
    .toString()
    .trim()
    .toLowerCase();

  const nilai =
    satuan === "ton"
      ? berat * 1000
      : berat;

  const jenis = (
    item.jenis_transaksi || "masuk"
  )
    .toString()
    .toLowerCase();

  if (jenis === "keluar") {
    gradeMap[grade] -= nilai;
  } else {
    gradeMap[grade] += nilai;
  }
});

const gradeData = Object.entries(gradeMap)
  .filter(([_, total]) => total > 0)
  .sort((a, b) => b[1] - a[1]);

console.log("AUDIT LOG:", auditLogs);

const recentActivities = [...auditLogs]
  .sort(
    (a, b) =>
      new Date(b.tanggal) -
      new Date(a.tanggal)
  )
  .slice(0, 5);

  const handleLogout = () => {
  localStorage.clear();

  setIsLogin(false);

  alert("Anda telah logout");

  navigate("/", { replace: true });
};

  const DashboardHome = () => {
    const chartData = {
      labels: historyData.map((item) =>
        item.tanggal
          ? item.tanggal.substring(0, 10)
          : "-"
      ),

      datasets: [
        {
          label: "Panen",
          data: panenData,
          fill: true,
          backgroundColor:
            "rgba(139,195,70,0.2)",
          borderColor: "#8BC346",
          tension: 0.4,
        },
        {
          label: "Gagal",
          data: gagalData,
          fill: true,
          backgroundColor:
            "rgba(255,0,0,0.1)",
          borderColor: "#ef4444",
          tension: 0.4,
        },
      ],
    };

    return (
      <>
        <div className="grid grid-cols-4 gap-5">
          <Card
            title="Total User"
            value={users.length}
            icon={<UsersIcon />}
          />

          <Card
            title="Sisa Stok"
            value={`${sisaStok.toFixed(0)} Kg`}
            icon={<Leaf />}
          />

          <Card
            title="Stok Keluar"
            value={`${stokKeluar} Kg`}
            icon={<TrendingUp />}
          />

          <Card
            title="Gagal Panen"
            value={totalGagal}
            icon={<AlertCircle />}
          />
        </div>

        <div className="grid grid-cols-3 gap-5 mt-6">
          <div className="col-span-2 bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">
              Statistik Panen
            </h2>

            <div className="h-72">
              <Line data={chartData} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">
              Grade Komoditas
            </h2>

            <div className="space-y-3">
              {gradeData.length > 0 ? (
                gradeData.map(([grade, total], index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>
                      Grade {grade}
                    </span>

                    <span className="font-semibold text-[#8BC346]">
                      {total.toFixed(0)} Kg
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  Belum ada data grade
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mt-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">
              Top Lahan
            </h2>

            <ul className="text-sm text-gray-600 space-y-1">
              {topLahan.map((l, i) => (
                <li key={i}>
                  {i + 1}. {l.nama} - {l.total} Kg
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">
              Aktivitas Terbaru
            </h2>

            <ul className="text-sm text-gray-600 space-y-2">
              {recentActivities.length > 0 ? (
                recentActivities.map(
                  (log, index) => (
                    <li
                      key={index}
                      className="border-b pb-2"
                    >
                      <div className="font-medium text-gray-700">
                        {log.aktivitas}
                      </div>

                      <div className="text-xs text-gray-500">
                        {log.detail}
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        {log.user_type} • {log.tanggal}
                      </div>
                    </li>
                  )
                )
              ) : (
                <li>Belum ada aktivitas</li>
              )}
            </ul>
          </div>
        </div>
      </>
    );
  };

  const getPageTitle = () => {
  switch (location.pathname) {
    case "/dashboard":
      return "Dashboard";

    case "/dashboard/users":
      return "Manajemen User";

    case "/dashboard/master-data":
      return "Master Data";

    case "/dashboard/audit-log":
      return "Audit Log";

    default:
      return "Dashboard";
  }
};

  const isDashboardHome =
    location.pathname === "/dashboard";

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}

      <div className="w-64 text-white flex flex-col h-screen bg-gradient-to-b from-[#8BC346] to-green-700">
        <div className="h-16 flex items-center px-6 border-b border-white">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Leaf size={26} />
            Ladentra
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Menu
            label="Dashboard"
            active={
              location.pathname === "/dashboard"
            }
            onClick={() =>
              navigate("/dashboard")
            }
          />

          <Menu
            label="Users"
            active={location.pathname.includes(
              "/dashboard/users"
            )}
            onClick={() =>
              navigate("/dashboard/users")
            }
          />

          <Menu
            label="Master Data"
            active={location.pathname.includes(
              "/dashboard/master-data"
            )}
            onClick={() =>
              navigate(
                "/dashboard/master-data"
              )
            }
          />

          <Menu
            label="Audit Log"
            active={location.pathname.includes(
              "/dashboard/audit-log"
            )}
            onClick={() =>
              navigate("/dashboard/audit-log")
            }
          />
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 p-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 h-16 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold text-gray-600">
            {getPageTitle()}
          </h2>

          <span className="text-gray-700 font-medium">
            Halo, {username} 👋
          </span>
        </div>

        <div className="p-6 overflow-auto">
          {isDashboardHome ? (
            <DashboardHome />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

const Menu = ({ label, onClick, active }) => (
  <div
    onClick={onClick}
    className={`p-3 rounded-lg cursor-pointer transition ${
      active
        ? "bg-white text-green-700 font-semibold shadow"
        : "hover:bg-green-600"
    }`}
  >
    {label}
  </div>
);

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center border-l-4 border-[#8BC346]">
    <div>
      <h2 className="text-gray-500 text-sm">
        {title}
      </h2>

      <p className="text-2xl font-bold text-[#8BC346] mt-1">
        {value}
      </p>
    </div>

    <div className="bg-green-100 p-2 rounded-full text-[#8BC346]">
      {icon}
    </div>
  </div>
);
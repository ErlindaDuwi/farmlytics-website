import { useState, useEffect } from "react";
import axios from "axios";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs();
  }, []);

  const getAuditLogs = async () => {
    try {
      const res = await axios.get(
        "http://10.220.97.182:5000/audit-log"
      );

      setLogs(res.data);
    } catch (error) {
      console.error("Gagal mengambil audit log:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (aktivitas) => {
    switch (aktivitas) {
      case "Login":
        return "bg-blue-100 text-blue-700";

      case "Logout":
        return "bg-gray-100 text-gray-700";

      case "Tambah User":
        return "bg-green-100 text-green-700";

      case "Input Data":
      case "Input Data Voice":
      case "Input Data Manual":
        return "bg-yellow-100 text-yellow-700";

      case "Edit Data":
        return "bg-orange-100 text-orange-700";

      case "Hapus Data":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      {/* HEADER - DISAMAKAN DENGAN MASTER DATA */}
      <div className="flex justify-between items-center mb-5">
      <div>
        <h1 className="text-xl font-bold text-gray-700">
          Audit Log
        </h1>
        <p className="text-sm text-gray-400">
          Monitoring aktivitas pengguna dan sistem
        </p>
      </div>
    </div>

      {/* CARD */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[500px]">
        <h2 className="text-2xl font-bold text-green-700 mb-5">
          Riwayat Aktivitas Sistem
        </h2>

        <div className="space-y-3">
          {loading ? (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-400">
              Memuat audit log...
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-400">
              Belum ada aktivitas
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-50 border rounded-xl p-4 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                      log.aktivitas
                    )}`}
                  >
                    {log.aktivitas}
                  </span>

                  <span className="text-xs text-gray-500">
                    {log.tanggal}
                  </span>
                </div>

                <div className="text-gray-700 font-medium">
                  {log.detail}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  User Type : {log.user_type}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
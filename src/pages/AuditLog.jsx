import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";

export default function AuditLog() {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    username: "",
    password: "",
    role: "Petugas",
  });

  const [logs, setLogs] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const tambahUser = () => {
    if (!form.nama || !form.username || !form.password) {
      alert("Lengkapi data");
      return;
    }

    // SIMPAN KE DATABASE/API DISINI

    // Tambahkan log user baru
    const newLog = `Admin - Menambahkan ${form.role} (${form.username})`;

    setLogs([newLog, ...logs]);

    // Reset form
    setForm({
      nama: "",
      username: "",
      password: "",
      role: "Petugas",
    });

    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Tambah User
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-lime-500 hover:bg-lime-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow"
        >
          <Plus size={18} />
          Tambah User
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold text-green-700 mb-5">
          User Baru
        </h2>

        <div className="space-y-3">

          {logs.length === 0 ? (
            <div className="bg-gray-50 border rounded-xl p-4 text-gray-400">
              Belum ada user ditambahkan
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className="bg-gray-50 border rounded-xl p-4 hover:bg-gray-100 transition"
              >
                {log}
              </div>
            ))
          )}

        </div>
      </div>

      {/* Modal Tambah User */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[450px] p-6 shadow-xl">

            <div className="flex items-center gap-2 mb-5">
              <UserPlus className="text-lime-500" />
              <h2 className="text-2xl font-bold">
                Tambah User
              </h2>
            </div>

            <div className="space-y-4">

              <input
                type="text"
                name="nama"
                placeholder="Nama Lengkap"
                value={form.nama}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-lime-400 outline-none"
              />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-lime-400 outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-lime-400 outline-none"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-lime-400 outline-none"
              >
                <option>Admin</option>
                <option>Petugas</option>
                <option>Supervisor</option>
                <option>Dinas</option>
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                onClick={tambahUser}
                className="px-5 py-2 rounded-xl bg-lime-500 hover:bg-lime-600 text-white"
              >
                Simpan
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
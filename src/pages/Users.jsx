import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, Search, Eye, EyeOff } from "lucide-react";

// 🔥 PENTING: PASTIKAN IP INI SAMA DENGAN FLASK KAMU
const API_URL = "http://192.168.1.9:5000/api/users";
const BASE_URL = "http://192.168.1.9:5000"; // Untuk memuat gambar foto

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      alert("Tidak bisa konek ke backend!");
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.username || !form.password || !form.role) {
      return alert("Nama, Username, Password, dan Role wajib diisi!");
    }

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${form.id}/${form.role}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchUsers();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan data");
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      password: user.password || "",
      role: user.role || "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id, role) => {
    if (confirm("Yakin hapus user ini? Data di mobile juga akan terhapus.")) {
      try {
        await axios.delete(`${API_URL}/${id}/${role}`);
        fetchUsers();
      } catch (err) {
        alert("Gagal menghapus user");
      }
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", username: "", email: "", phone: "", password: "", role: "" });
    setIsEdit(false);
    setShowModal(false);
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / dataPerPage);
  const startIndex = (currentPage - 1) * dataPerPage;
  const currentData = filteredUsers.slice(startIndex, startIndex + dataPerPage);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-700">Manajemen User</h1>
          <p className="text-sm text-gray-400">Kelola profil, email, foto, dan role pengguna</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama/username/email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-lg focus:outline-[#8BC346] w-64 text-sm"
            />
          </div>

          <button onClick={() => setShowModal(true)} className="bg-[#8BC346] hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow text-sm">
            <Plus size={18} /> Tambah
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden min-h-[400px]">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-[#8BC346] text-white">
            <tr>
              <th className="p-3 w-16">ID</th>
              <th className="w-16">Foto</th>
              <th>Nama</th>
              <th>Username</th>
              <th>Email</th>
              <th>No HP</th>
              <th>Password</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((u) => (
              <tr key={`${u.role}-${u.id}`} className="text-center border-b hover:bg-green-50 align-middle">
                <td className="p-3">USR-{u.id}</td>
                
                {/* ✅ KOLOM FOTO */}
                <td>
                  {u.foto ? (
                    <img
                      src={`${BASE_URL}/uploads/${u.foto}`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover mx-auto border border-gray-200 shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.style.display='none' }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 mx-auto flex items-center justify-center border border-gray-300">
                      <span className="text-gray-400 text-[10px] font-semibold">No Pic</span>
                    </div>
                  )}
                </td>

                <td className="truncate px-2" title={u.name}>{u.name}</td>
                <td className="font-semibold text-gray-700 truncate">{u.username}</td>
                
                {/* ✅ KOLOM EMAIL */}
                <td className="truncate px-2 text-xs" title={u.email}>{u.email || "-"}</td>
                
                <td className="truncate">{u.phone || "-"}</td>
                <td>{showPassword ? u.password : "••••••"}</td>

                <td>
                  <span className={`px-2 py-1 rounded text-white text-xs inline-block
                      ${u.role === "Admin" && "bg-gray-700"}
                      ${u.role === "Petugas" && "bg-green-500"}
                      ${u.role === "Supervisor" && "bg-blue-500"}
                      ${u.role === "Dinas" && "bg-purple-500"}
                    `}>
                    {u.role}
                  </span>
                </td>

                <td className="flex justify-center gap-2 p-2 mt-1.5">
                  <button onClick={() => handleEdit(u)} className="bg-yellow-400 hover:bg-yellow-500 text-white p-1.5 rounded" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(u.id, u.role)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded" title="Hapus">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentData.length === 0 && <p className="text-center p-4 text-gray-500">Data tidak ditemukan</p>}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4 text-sm">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50">Prev</button>
        <span className="py-1">Halaman {currentPage} dari {totalPages || 1}</span>
        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50">Next</button>
      </div>

      <div className="mt-3">
        <button onClick={() => setShowPassword(!showPassword)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
        </button>
      </div>

      {/* MODAL INPUT/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{isEdit ? "Edit User" : "Tambah User"}</h2>
            <input placeholder="Nama Lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border p-2 mb-3 rounded focus:outline-[#8BC346]" />
            <input placeholder="Username (Untuk Login)" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border p-2 mb-3 rounded focus:outline-[#8BC346] bg-gray-50" disabled={isEdit} />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2 mb-3 rounded focus:outline-[#8BC346]" />
            <input placeholder="Nomor HP" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border p-2 mb-3 rounded focus:outline-[#8BC346]" />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border p-2 mb-3 rounded focus:outline-[#8BC346]" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border p-2 mb-4 rounded focus:outline-[#8BC346] bg-gray-50" disabled={isEdit}>
              <option value="">Pilih Role</option>
              <option value="Admin">Admin</option>
              <option value="Petugas">Petugas</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Dinas">Dinas</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-gray-800 font-medium">Batal</button>
              <button onClick={handleSave} className="bg-[#8BC346] hover:bg-green-600 text-white px-4 py-2 rounded font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
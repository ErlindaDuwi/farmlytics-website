import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login({ setIsLogin }) {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    // VALIDASI
    if (!user || !pass) {
      alert("Username dan Password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // ================= REQUEST KE FLASK =================
      const response = await fetch("http://192.168.1.9:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: user,
          password: pass,
          role: "Admin", // LOGIN WEBSITE KHUSUS ADMIN
        }),
      });

      const data = await response.json();

      console.log("RESPONSE LOGIN:", data);

      // ================= JIKA BERHASIL =================
      if (response.ok && data.status === "success") {
        localStorage.setItem("login", "true");
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        setIsLogin(true);

        alert(data.message || "Login berhasil");

        navigate("/dashboard");
      } 
      
      // ================= JIKA GAGAL =================
      else {
        alert(data.message || "Username / Password salah!");
      }

    } catch (error) {
      console.error("ERROR LOGIN:", error);

      alert("Tidak bisa konek ke server!");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-green-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-80 transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-center text-[#8BC346] mb-2">
          Login Admin
        </h1>

        <p className="text-sm text-gray-400 text-center mb-6">
          Silakan masuk ke dashboard
        </p>

        {/* USERNAME */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC346] transition"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC346] transition"
          />
        </div>

        {/* BUTTON LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8BC346] text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          © 2026 Admin Panel
        </p>
      </form>
    </div>
  );
}
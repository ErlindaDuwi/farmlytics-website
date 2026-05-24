import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login({ setIsLogin }) {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    if (e) e.preventDefault(); // 🔥 biar form gak reload

    if (user === "admin" && pass === "admin") {
      localStorage.setItem("login", "true");
      setIsLogin(true);
      navigate("/dashboard");
    } else {
      alert("Username / Password salah!");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-green-100">
      
      <form 
        onSubmit={handleLogin} // 🔥 ENTER otomatis trigger
        className="bg-white p-8 rounded-2xl shadow-xl w-80 transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-center text-[#8BC346] mb-2">
          Login Admin
        </h1>

        <p className="text-sm text-gray-400 text-center mb-6">
          Silakan masuk ke dashboard
        </p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC346] transition"
            onChange={(e) => setUser(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC346] transition"
            onChange={(e) => setPass(e.target.value)}
          />
        </div>

        <button
          type="submit" // 🔥 penting untuk ENTER
          className="w-full bg-[#8BC346] text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
        >
          Login
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          © 2026 Admin Panel
        </p>
      </form>
    </div>
  );
}

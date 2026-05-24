export default function Sidebar({ setMenu }) {
  return (
    <div className="w-64 bg-green-700 text-white h-full p-4">
      <h1 className="text-2xl font-bold mb-6">Farmlytics</h1>

      <button onClick={() => setMenu("dashboard")} className="block mb-2">
        Dashboard
      </button>
      <button onClick={() => setMenu("users")} className="block mb-2">
        User
      </button>
      <button onClick={() => setMenu("master")} className="block mb-2">
        Master Data
      </button>
      <button onClick={() => setMenu("audit")} className="block">
        Audit Log
      </button>
    </div>
  );
}

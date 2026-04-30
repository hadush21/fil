import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  User,
  ChevronRight,
  PlusCircle,
  Trash2,
} from "lucide-react";

// ✅ Month helper
const getMonthName = (month) => {
  const months = [
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
  ];

  return months[Number(month) - 1] || "";
};

const HomePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    opening_balance: "",
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ GET REPORTS
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get("/reports");
        setReports(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // ✅ CREATE REPORT (WITH VALIDATION)
  const handleCreateReport = async (e) => {
    e.preventDefault();
    setError("");

    // 🔥 VALIDATION
    if (!formData.title.trim()) {
      setError("❌ Title is required");
      return;
    }

    if (!formData.month || formData.month < 1 || formData.month > 12) {
      setError("❌ Month must be between 1 and 12");
      return;
    }

    if (!formData.year) {
      setError("❌ Year is required");
      return;
    }

    if (formData.opening_balance === "") {
      setError("❌ Opening balance is required");
      return;
    }

    try {
      const res = await api.post("/reports", {
        title: formData.title.trim(),
        month: Number(formData.month),
        year: Number(formData.year),
        opening_balance: parseFloat(formData.opening_balance),
      });

      setReports([res.data, ...reports]);

      setFormData({
        title: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        opening_balance: "",
      });

      navigate(`/reports/${res.data.id}`);
    } catch (err) {
      console.log(err);
      setError("❌ Failed to create report");
    }
  };

  // ✅ DELETE REPORT
  const handleDeleteReport = async (e, id) => {
    e.stopPropagation();

    if (!window.confirm("Delete this report?")) return;

    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter((r) => r.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">

      {/* HEADER */}
      <header className="max-w-2xl mx-auto mb-6 flex flex-col items-start">

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 mb-4"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-full flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Financial Dashboard
          </h1>

          <User className="text-blue-600 bg-blue-100 rounded-full p-1.5" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto space-y-8">

      
  
        {/* CREATE FORM */}
        <section className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <PlusCircle className="text-blue-600" />
            Start New Report
          </h2>

          {/* ❌ ERROR DISPLAY */}
          {error && (
            <div className="mb-3 p-3 text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateReport} className="space-y-4">

            <input
              className="w-full p-3 border rounded"
              placeholder="Report Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">

              <input
                type="number"
                className="p-3 border rounded"
                placeholder="Month (1-12)"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
              />

              <input
                type="number"
                className="p-3 border rounded"
                placeholder="Year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              />

            </div>

            <input
              type="number"
              className="w-full p-3 border rounded"
              placeholder="Opening Balance"
              value={formData.opening_balance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  opening_balance: e.target.value,
                })
              }
            />

            <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
              Create
            </button>

          </form>
        </section>

        {/* REPORT LIST */}
        <section className="space-y-3">

          {loading && <p>Loading...</p>}
          <h2 className="text-lg font-bold text-gray-800 mb-3">
  All Reports
</h2>

          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => navigate(`/reports/${report.id}`)}
              className="bg-white p-5 rounded-xl flex justify-between items-center shadow hover:shadow-md cursor-pointer"
            >

              <div className="flex gap-3 items-center">

                <button
                  onClick={(e) => handleDeleteReport(e, report.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>

                <div>
                  <h3 className="font-bold">{report.title}</h3>
                  <p className="text-xs text-gray-500">
                    {getMonthName(report.month)} / {report.year}
                  </p>
                </div>

              </div>

              <ChevronRight />

            </div>
          ))}

        </section>

      </main>
    </div>
  );
};

export default HomePage;
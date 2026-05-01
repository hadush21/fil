import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // transaction form
  const [form, setForm] = useState({
    type: "income",
    date: "",
    description: "",
    amount: "",
  });

  // =========================
  // FETCH REPORT
  // =========================
  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reports/${id}`);
      setReport(res.data);
    } catch (err) {
      console.log("Error loading report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // =========================
  // ADD TRANSACTION
  // =========================
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!form.date || !form.description || !form.amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post(`/reports/${id}/transactions`, {
        type: form.type,
        date: form.date,
        description: form.description,
        amount: Number(form.amount),
      });

      await fetchReport();

      setForm({
        type: "income",
        date: "",
        description: "",
        amount: "",
      });
    } catch (err) {
      console.log("Transaction error:", err);
      alert("Failed to add transaction");
    }
  };

  // =========================
  // DELETE TRANSACTION (NEW ADDED)
  // =========================
  const handleDeleteTransaction = async (transactionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/transactions/${transactionId}`);

      // refresh report after delete
      await fetchReport();
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete transaction");
    }
  };

  // =========================
  // LOADING / ERROR STATES
  // =========================
  if (loading) return <p className="p-5">Loading...</p>;

  if (!report) return <p className="p-5 text-red-500">Report not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* ================= HEADER ================= */}
      <header className="max-w-3xl mx-auto mb-6">

        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          {report.title}
        </h1>

        <p className="text-sm text-gray-500">
          Month: {report.month} / Year: {report.year}
        </p>
      </header>

      {/* ================= SUMMARY ================= */}
      <section className="max-w-3xl mx-auto bg-white p-5 rounded-xl shadow mb-6">

        <div className="grid grid-cols-3 gap-4 text-center">

          <div>
            <p className="text-gray-500 text-sm">Opening</p>
            <p className="font-bold">{report.opening_balance}</p>
          </div>

          <div>
            <p className="text-green-600 text-sm">Income</p>
            <p className="font-bold text-green-600">
              {report.total_income}
            </p>
          </div>

          <div>
            <p className="text-red-600 text-sm">Expenses</p>
            <p className="font-bold text-red-600">
              {report.total_expenses}
            </p>
          </div>

        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">Closing Balance</p>
          <p className="text-xl font-bold text-blue-600">
            {report.closing_balance}
          </p>
        </div>

      </section>

      {/* ================= ADD TRANSACTION ================= */}
      <section className="max-w-3xl mx-auto bg-white p-5 rounded-xl shadow mb-6">

        <h2 className="text-lg font-bold mb-3">Add Transaction</h2>

        <form onSubmit={handleAddTransaction} className="space-y-3">

          <select
            className="w-full p-2 border rounded"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="date"
            className="w-full p-2 border rounded"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full p-2 border rounded"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Add Transaction
          </button>

        </form>
      </section>

      {/* ================= TRANSACTIONS ================= */}
      <section className="max-w-3xl mx-auto">

        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Transactions
        </h2>

        {report.transactions?.length === 0 ? (
          <p className="text-gray-400">No transactions yet</p>
        ) : (
          report.transactions.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center mb-2"
            >
              <div>
                <p className="font-semibold">{t.description}</p>
                <p className="text-xs text-gray-500">{t.date}</p>
              </div>

              <div className="flex items-center gap-3">

                <p
                  className={
                    t.type === "income"
                      ? "text-green-600 font-bold"
                      : "text-red-500 font-bold"
                  }
                >
                  {t.type === "income" ? "+" : "-"} {t.amount}
                </p>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDeleteTransaction(t.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>

              </div>
            </div>
          ))
        )}

      </section>

    </div>
  );
};

export default ReportPage;
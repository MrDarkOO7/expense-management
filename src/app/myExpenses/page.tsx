"use client";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/clientApp";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const expenseOptions = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Miscellaneous",
];

interface Expense {
  id: string;
  date: string;
  type: string;
  amount: number;
  description?: string;
  createdAt?: any;
}

export default function MyExpensesPage() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [filtered, setFiltered] = useState<Expense[]>([]);
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchExpenses = async () => {
    // setLoading(true);
    const snapshot = await db
      .collection("expenses")
      .orderBy("date", "desc")
      .get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];
    setAllExpenses(data);
    setFiltered(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filterExpenses = () => {
    let filtered = allExpenses;
    if (type) {
      filtered = filtered.filter((exp) =>
        exp.type.toLowerCase().includes(type.toLowerCase()),
      );
    }
    if (fromDate) {
      filtered = filtered.filter(
        (exp) => new Date(exp.date) >= new Date(fromDate),
      );
    }
    if (toDate) {
      filtered = filtered.filter(
        (exp) => new Date(exp.date) <= new Date(toDate),
      );
    }
    setFiltered(filtered);
  };

  useEffect(() => {
    filterExpenses();
  }, [toDate, fromDate, type]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="relative mx-auto max-w-[36rem] mb-4">
        <button
          onClick={() => router.back()}
          className="absolute left-0 top-1 text-black hover:cursor-pointer transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2 " />
        </button>
        <h1 className="text-xl font-bold text-center">
          Expense Search
        </h1>
      </div>
      <div className="max-w-[36rem] mx-auto bg-white p-4 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expense Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 shadow-sm"
          >
            <option value="">Select to filter by type</option>
            {expenseOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 shadow-sm"
            />
          </div>
        </div>

        <div className="flex justify-between gap-4">
          {/* <button
            onClick={filterExpenses}
            className="flex-1 bg-black text-white py-2 rounded-lg shadow hover:bg-yellow-300 hover:text-black transition"
          >
            Display
          </button> */}
          <button
            onClick={() => setShowSummary(!showSummary)}
            disabled={loading}
            className="flex-1 bg-black text-white py-2 rounded-lg shadow hover:bg-yellow-300 hover:text-black transition"
          >
            Summary
          </button>
        </div>
        {showSummary && (
          <div className="max-w-[36rem] w-full flex flex-col pb-2 rounded-lg shadow items-center justify-center">
            Total Expenses:{" "}
            {filtered.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="">loading data....</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Inv #</th>
                  <th className="px-2 py-1 border">Date</th>
                  <th className="px-2 py-1 border">Expense Type</th>
                  <th className="px-2 py-1 border text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp, idx) => (
                  <tr key={exp.id} className="">
                    <td className="px-2 py-1 border">{idx + 1}</td>
                    <td className="px-2 py-1 border">
                      {new Date(exp.date).toLocaleDateString("en-GB")}{" "}
                      {exp.createdAt?.toDate?.().toLocaleTimeString("en-GB")}
                    </td>
                    <td className="px-2 py-1 border">{exp.type}</td>
                    <td className="px-2 py-1 border border-black text-right text-red-600">
                      {exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No matching expenses
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

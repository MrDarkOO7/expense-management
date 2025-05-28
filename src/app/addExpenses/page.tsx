"use client";
import React, { useState } from "react";
import { db } from "../../../firebase/clientApp";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const expenseOptions = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Miscellaneous",
];

export default function AddExpensePage() {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!date || !type || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await db.collection("expenses").add({
        date,
        type,
        amount: parseFloat(amount),
        description,
        createdAt: new Date(),
      });
      toast.success("Expense saved!");
      setDate("");
      setType("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-center items-center mx-auto max-w-[36rem] gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-start text-sm w-[37%] text-black hover:cursor-pointer transition mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2 " />
        </button>
        <h1 className="flex items-start w-[62%] text-xl font-bold text-center my-4">
          Daily Expenses
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-[36rem] mx-auto bg-white p-4 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expense Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 h-[42px] bg-yellow-100 shadow-sm"
          >
            <option value="">Select type</option>
            {expenseOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border max-h-[12rem] min-h-[42px] rounded-lg px-3 py-2 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 mt-4 bg-black text-white rounded-lg shadow hover:bg-amber-200 hover:text-black transition w-full transition"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
}

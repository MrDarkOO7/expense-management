"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-8">
      <h1 className="text-3xl font-bold underline w-full text-center">
        Expense Management
      </h1>
      <p className="mt-4 w-full text-center">
        Welcome to the Expense Management App!
      </p>
      <p className="text-center">
        This app helps you track your expenses efficiently.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 py-6">
        <button
          className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-amber-200 hover:text-black transition"
          onClick={() => route.push("/myExpenses")}
        >
          My Expenses
        </button>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-amber-200 hover:text-black transition"
          onClick={() => route.push("/addExpenses")}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

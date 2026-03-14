import React, { useState } from "react";
import { LogOut, PieChart, PlusCircle, Settings, ListFilter } from "lucide-react";
import AddExpense from "../sections/AddExpense";
import ExpenseList from "../sections/ExpenseList";
import Filters from "../sections/Filters";
import Reports from "../sections/Reports";
import ProfileSettings from "../sections/ProfileSettings";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { Wallet, Mail, Github, Linkedin } from "lucide-react";

export default function DashboardPage() {

  const nav = useNavigate();

  const [filters, setFilters] = useState({
    category: "All",
    start: "",
    end: "",
  });

  const logout = async () => {
    await auth.signOut();
    nav("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex flex-col">

      {/* 🌟 Navbar */}
      <header className="backdrop-blur-md bg-gray-800/60 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

          <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Expense Tracker
          </h2>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

        </div>
      </header>


      {/* 🌈 Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="flex flex-col gap-6">

          <div className="bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-teal-400">
              <PlusCircle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Add Expense</h3>
            </div>
            <AddExpense />
          </div>

          <div className="bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-purple-400">
              <Settings className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Profile Settings</h3>
            </div>
            <ProfileSettings />
          </div>

        </div>


        {/* Right Column */}
        <div className="md:col-span-2 flex flex-col gap-6">

          <div className="bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-blue-400">
              <ListFilter className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          <div className="bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <PieChart className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Expense List</h3>
            </div>
            <ExpenseList filters={filters} />
          </div>

          <div className="bg-gray-800/80 p-5 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-green-400">
              <PieChart className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Reports</h3>
            </div>
            <Reports filters={filters} />
          </div>

        </div>

      </main>


      {/* 🌙 Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2">
            <Wallet className="text-blue-400" size={22} />
            <span className="font-semibold text-white">
              Expense Tracker
            </span>
          </div>

          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>

            <Link to="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-5 text-gray-400">

            <a
              href="mailto:youloos477@gmail.com"
              className="hover:text-white transition"
            >
              <Mail size={20} />
            </a>

            <a
              href="https://github.com/malik-tanveer"
              target="_blank"
              className="hover:text-white transition"
            >
              <Github size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/malik-tanveer-8bbaa13b2"
              target="_blank"
              className="hover:text-white transition"
            >
              <Linkedin size={20} />
            </a>

          </div>

        </div>

        <div className="border-t border-white/10 text-center text-gray-500 text-sm py-4">
          © {new Date().getFullYear()} Expense Tracker • Built by Tanveer Malik
        </div>

      </footer>

    </div>
  );
}
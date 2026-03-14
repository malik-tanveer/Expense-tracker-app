import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

type Expense = {
  id: string;
  amount: number;
  category: string;
  notes?: string;
  date?: Date | null;
  customCategory?: string;
};

type ExpenseListProps = {
  filters: {
    category: string;
    start: string;
    end: string;
  };
};

export default function ExpenseList({ filters }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editAmount, setEditAmount] = useState<number | "">("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setExpenses(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            amount: data.amount,
            category: data.category,
            notes: data.notes || "",
            date: data.date?.toDate ? data.date.toDate() : null,
          } as Expense;
        })
      );
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!auth.currentUser) return;
    if (!confirm("Delete this expense?")) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "expenses", id));
  };

  const openEdit = (e: Expense) => {
    setEditing(e);
    setEditNotes(e.notes || "");
    setEditAmount(e.amount);
  };

  const saveEdit = async () => {
    if (!editing || !auth.currentUser) return;

    const ref = doc(db, "users", auth.currentUser.uid, "expenses", editing.id);

    const finalCategory =
      editing.category === "Other" && editing.customCategory
        ? editing.customCategory
        : editing.category;

    await updateDoc(ref, {
      category: finalCategory,
      amount: Number(editAmount),
      notes: editNotes,
    });

    setEditing(null);
  };

  // Filtering
  const filtered = expenses.filter((ex) => {
    const matchesCategory =
      filters.category === "All" || ex.category === filters.category;

    const matchesStart = filters.start
      ? ex.date && ex.date >= new Date(filters.start)
      : true;

    const matchesEnd = filters.end
      ? ex.date && ex.date <= new Date(filters.end)
      : true;

    return matchesCategory && matchesStart && matchesEnd;
  });

  // Group by date
  const grouped: Record<string, Expense[]> = {};

  filtered.forEach((ex) => {
    const dateStr = ex.date ? ex.date.toLocaleDateString() : "No Date";
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(ex);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700"
    >
      <h3 className="text-2xl font-semibold text-white mb-5 flex items-center gap-2">
        📋 Expenses
      </h3>

      <div className="max-h-[420px] overflow-y-auto pr-2 custom-scroll">

        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-gray-400 py-6">
            No expenses match filters
          </p>
        )}

        {Object.entries(grouped).map(([date, exList]) => (
          <div key={date} className="mb-6">

            <h4 className="text-lg font-medium text-white mb-3 border-b border-gray-700 pb-1">
              {date}
            </h4>

            <table className="w-full text-left border-collapse rounded-xl overflow-hidden">

              <thead>
                <tr className="bg-gray-700/60 text-gray-300 text-sm">
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Notes</th>
                  <th className="px-4 py-2 w-[120px] text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {exList.map((ex) => (
                    <motion.tr
                      key={ex.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-gray-700 hover:bg-gray-700/40 transition"
                    >

                      <td className="px-4 py-2 text-white">
                        {ex.category}
                      </td>

                      <td className="px-4 py-2 font-semibold text-green-400">
                        Rs {ex.amount}
                      </td>

                      <td className="px-4 py-2 text-gray-300 max-w-[300px] break-words">
                        {ex.notes}
                      </td>

                      <td className="px-4 py-2 w-[120px]">
                        <div className="flex flex-col items-end gap-2">

                          <button
                            onClick={() => openEdit(ex)}
                            className="w-[70px] py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(ex.id)}
                            className="w-[70px] py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>

            </table>

          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >

              <h4 className="text-xl font-semibold text-white mb-4">
                Edit Expense
              </h4>

              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(Number(e.target.value))}
                className="w-full mb-3 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
              />

              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white resize-none"
              />

              <div className="flex justify-end gap-3">

                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  Save
                </button>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
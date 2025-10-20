import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Circle, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category: "work" | "personal" | "shopping" | "health";
}

const CATEGORIES = [
  { id: "work", label: "Work", color: "bg-blue-100 text-blue-700" },
  { id: "personal", label: "Personal", color: "bg-purple-100 text-purple-700" },
  { id: "shopping", label: "Shopping", color: "bg-green-100 text-green-700" },
  { id: "health", label: "Health", color: "bg-red-100 text-red-700" },
];

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Todo["category"]>(
    "work"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: input,
        completed: false,
        createdAt: Date.now(),
        category: selectedCategory,
      };
      setTodos([newTodo, ...todos]);
      setInput("");
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateTodo = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingId(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };

  const getCategoryColor = (category: Todo["category"]) => {
    return CATEGORIES.find((c) => c.id === category)?.color || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header with branding */}
      <header className="border-b border-slate-700 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center"
              >
                <Check className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Avazxanov Abdulhay
                </h1>
                <p className="text-sm text-slate-400">
                  Professional Note & Task Manager
                </p>
              </div>
            </div>
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-slate-400"
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Total", value: stats.total, color: "from-blue-600 to-cyan-600" },
            { label: "Active", value: stats.active, color: "from-amber-600 to-orange-600" },
            { label: "Completed", value: stats.completed, color: "from-emerald-600 to-green-600" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              className={cn(
                "bg-gradient-to-br p-4 rounded-xl border border-slate-700",
                stat.color
              )}
            >
              <p className="text-white/80 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 mb-8 shadow-xl"
        >
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Create New Task
          </label>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task, note, or reminder..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setSelectedCategory(cat.id as Todo["category"])
                  }
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                    selectedCategory === cat.id
                      ? cat.color + " ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-400"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  )}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addTodo}
            className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </motion.button>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {(["all", "active", "completed"] as const).map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                filter === f
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Todo List */}
        <motion.div
          layout
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                  className={cn(
                    "group bg-slate-800/50 backdrop-blur-md border rounded-xl p-4 transition-all hover:bg-slate-800 shadow-lg",
                    todo.completed
                      ? "border-slate-600 opacity-75"
                      : "border-slate-700 hover:border-cyan-500"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTodo(todo.id)}
                      className="mt-1 flex-shrink-0 transition-colors"
                    >
                      {todo.completed ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Check className="w-6 h-6 text-emerald-500" />
                        </motion.div>
                      ) : (
                        <Circle className="w-6 h-6 text-slate-500 group-hover:text-cyan-400" />
                      )}
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                updateTodo(todo.id, editText);
                              }
                            }}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateTodo(todo.id, editText)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded transition-colors"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingId(null)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded transition-colors"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <p
                            className={cn(
                              "text-white break-words",
                              todo.completed && "line-through text-slate-500"
                            )}
                          >
                            {todo.text}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-1 rounded-md",
                                getCategoryColor(todo.category)
                              )}
                            >
                              {CATEGORIES.find((c) => c.id === todo.category)
                                ?.label}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!todo.completed && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingId(todo.id);
                            setEditText(todo.text);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  🎯
                </motion.div>
                <p className="text-slate-400 font-medium">
                  {filter === "all" && "No tasks yet. Create one to get started!"}
                  {filter === "active" && "No active tasks. Great job!"}
                  {filter === "completed" && "No completed tasks yet."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm"
        >
          <p>
            Built with ❤️ by Avazxanov Abdulhay | Professional Task Manager
          </p>
        </motion.div>
      </main>
    </div>
  );
}

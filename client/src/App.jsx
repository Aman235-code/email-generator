/* eslint-disable no-unused-vars */
// 📄 client/src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  MailCheck,
  Sparkles,
  Smile,
  Handshake,
  PenLine,
  MessageSquareQuote,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const toneOptions = [
  { label: "Formal", icon: PenLine },
  { label: "Casual", icon: Smile },
  { label: "Friendly", icon: Handshake },
  { label: "Direct", icon: MessageSquareQuote },
];

export default function App() {
  const [email, setEmail] = useState("");
  const [tone, setTone] = useState(toneOptions[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reply, setReply] = useState(localStorage.getItem("lastReply") || "");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setReply("");

    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        emailContent: email,
        tone: tone.label,
      });
      setReply(res.data.reply);
      localStorage.setItem("lastReply", res.data.reply);
      toast.success("Reply generated successfully!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong while generating reply.");
      setReply("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex items-center justify-center font-inter">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <MailCheck className="text-blue-600" /> AI Email Responder (Cohere)
        </h1>

        <textarea
          rows="8"
          className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Paste the email you received..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mb-6 relative z-10">
          <label className="block mb-2 font-medium text-gray-700">Tone:</label>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between gap-2 w-full border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <tone.icon className="w-4 h-4" />
              {tone.label}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
              >
                {toneOptions.map((option) => (
                  <li
                    key={option.label}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setTone(option);
                      setShowDropdown(false);
                    }}
                  >
                    <option.icon className="w-4 h-4 text-blue-600" />
                    {option.label}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-md shadow-md hover:shadow-lg hover:brightness-110 transition disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Reply
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {reply && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 bg-gray-100 border rounded-xl relative"
            >
              <h2 className="font-semibold mb-2">AI Reply:</h2>
              <p className="whitespace-pre-wrap text-gray-800 text-sm">
                {reply}
              </p>
              <button
                className="cursor-pointer absolute top-4 right-4 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                onClick={handleCopy}
              >
                <Copy size={16} /> Copy
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-center text-red-600 font-semibold mt-8">
          Created by Aman Ahamed
        </p>
      </motion.div>
    </div>
  );
}

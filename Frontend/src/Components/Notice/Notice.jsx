import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Notice() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetch("/api/admin/notices")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // Debugging
        setNotices(Array.isArray(data) ? data : data.notices || []);
      })
      .catch((err) => console.error("Error fetching notices:", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg border border-gray-200">
      <motion.h2
        className="text-3xl font-bold text-gray-800 text-center mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📌 Official Notices
      </motion.h2>

      <div className="flex flex-col space-y-4">
        {notices.length > 0 ? (
          notices.map((notice, index) => (
            <motion.div
              key={index}
              className="bg-white p-4 rounded-md border-l-4 border-blue-500 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <p className="text-gray-800 font-medium">{notice.text}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No notices available.</p>
        )}
      </div>
    </div>
  );
}

// components/ExportButton.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiFile, FiFileText, FiGrid } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButton = ({ data, filename = 'employees' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Department', 'Salary'];
    const csvData = data.map(emp => [
      emp.id,
      emp.name,
      emp.email,
      emp.phone,
      emp.city,
      emp.department,
      emp.salary
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Employee Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

    const tableData = data.map(emp => [
      emp.name,
      emp.department,
      emp.city,
      `$${emp.salary}`
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Name', 'Department', 'City', 'Salary']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`${filename}.pdf`);
  };

  const exportToJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
      >
        <FiDownload />
        <span>Export</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700"
          >
            <button
              onClick={exportToCSV}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg"
            >
              <FiFileText className="text-green-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={exportToExcel}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2"
            >
              <FiGrid className="text-green-400" />
              <span>Excel</span>
            </button>
            <button
              onClick={exportToPDF}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2"
            >
              <FiFile className="text-red-400" />
              <span>PDF</span>
            </button>
            <button
              onClick={exportToJSON}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-2 last:rounded-b-lg"
            >
              <FiFileText className="text-yellow-400" />
              <span>JSON</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton;
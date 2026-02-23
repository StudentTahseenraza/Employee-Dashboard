import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data, filename) => {
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

export const exportToExcel = (data, filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Employees');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (data, filename) => {
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
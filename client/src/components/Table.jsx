import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { FaList } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react"; // Importing icons for edit and delete


const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};


// Function to format date to YY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA"); // "en-CA" formats as YYYY-MM-DD
};



const Table = ({ columns, data, onEdit = null, onDelete = null, onRestore = null, onPermanentDelete = null }) => {
  // Define color mapping for task statuses
  console.log("Product Data", data)
  const statusColors = {
    "Todo": "bg-blue-600",
    "In Progress": "bg-yellow-600",
    "Completed": "bg-green-600",
  };

  return (
    <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100 bg-white">
        {/* Table Header */}
        <thead className="bg-gray-200 text-gray-900">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap">
                {column.label}
              </th>
            ))}
            {/* Show Action Column Only If at Least One Action Exists */}
            {(onEdit || onDelete || onRestore || onPermanentDelete) && (
              <th className="px-4 py-3 text-left font-bold uppercase tracking-wider whitespace-nowrap">
                Action
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100 text-gray-700">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-200 transition-all hover:shadow-md transition-all duration-200">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                >
                  {/* Add color dot for status column */}
                  {column.key === "stage" ? (
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          statusColors[item[column.key]] || "bg-gray-600"
                        }`}
                      ></span>
                      <span>{item[column.key]}</span>
                    </div>
                  ) : column.key === "date" || column.key === "startDate" || column.key === "endDate" ? (
                    // Format date for dueDate column
                    formatDate(item[column.key])
                  ):(
                    item[column.key]
                  )}
                </td>
              ))}

              {/* Render Action Buttons Only If Any Action is Passed */}
              {(onEdit || onDelete || onRestore || onPermanentDelete) && (
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-4">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-400">
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    )}
                    {onRestore && (
                      <button onClick={() => onRestore(item)} className="text-green-500 hover:text-green-400">
                        <MdOutlineRestore size={18} />
                      </button>
                    )}
                    {onPermanentDelete && (
                      <button onClick={() => onPermanentDelete(item)} className="text-red-500 hover:text-red-400">
                        Delete Forever
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;





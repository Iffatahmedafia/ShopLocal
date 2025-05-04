import React, { useState, useMemo } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from "react-icons/md";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { FiSearch } from "react-icons/fi";


const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const statusColors = {
  Todo: "bg-blue-600",
  "In Progress": "bg-yellow-600",
  Completed: "bg-green-600",
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-CA");
};

const Table = ({
  columns,
  data,
  onEdit = null,
  onDelete = null,
  onRestore = null,
  onPermanentDelete = null,
  isAdmin= false,
  onAdminAction = null
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered and Paginated Data
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.some((col) =>
        String(item[col.key] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleApprove = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleDecline = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // inside your Table component (replacing return JSX)
return (
  <div className="w-full max-w-4xl mx-auto">
    {/* Search */}
    <div className="flex justify-end mb-4 px-2">
      <div className="relative w-56">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          <FiSearch />
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring focus:border-red-700"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
    

    {/* Table */}
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete || onRestore || onPermanentDelete) && (
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Action
              </th>
            )}
            {(isAdmin) && onAdminAction &&(
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Admin Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-5 text-gray-500">
                No results found.
              </td>
            </tr>
          ) : (
            paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 whitespace-nowrap text-sm max-w-xs overflow-hidden text-ellipsis"
                  >
                    {column.key === "stage" ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            statusColors[item[column.key]] || "bg-gray-500"
                          }`}
                        ></span>
                        {item[column.key]}
                      </div>
                    ) : ["date", "startDate", "endDate"].includes(column.key) ? (
                      formatDate(item[column.key])
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                {(onEdit || onDelete || onRestore || onPermanentDelete) && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-600">
                          <Edit size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      )}
                      {onRestore && (
                        <button onClick={() => onRestore(item)} className="text-green-500 hover:text-green-600">
                          <MdOutlineRestore size={18} />
                        </button>
                      )}
                      {onPermanentDelete && (
                        <button
                          onClick={() => onPermanentDelete(item)}
                          className="text-red-500 hover:text-red-600 text-xs font-semibold"
                        >
                          Delete Forever
                        </button>
                      )}
                    </div>
                  </td>
                )}
                {(isAdmin) && onAdminAction && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                    <button onClick={() => onAdminAction(item, "Approved")} className="text-green-600 hover:text-green-800 flex items-center gap-1">
                      <CheckCircle size={20} />
                    </button>

                    <button onClick={() => onAdminAction(item, "Declined")} className="text-red-500 hover:text-red-800 flex items-center gap-1">
                      <XCircle size={20} />
                    </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Bottom Controls */}
    <div className="flex flex-col sm:flex-row justify-between sm:items-center px-4 py-4 dark:bg-gray-900 rounded-b-lg border-t border-gray-100 dark:border-gray-700 gap-2 sm:gap-4">
      {/* Rows per page */}
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <span className="mr-2">Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setCurrentPage(1);
            onChangeRowsPerPage?.(parseInt(e.target.value)); // Optional external handler
          }}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-sm"
        >
          {[5, 10, 15].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
        <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
            }`}
          >
            <MdKeyboardArrowLeft size={20} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
            }`}
          >
            <MdKeyboardArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default Table;

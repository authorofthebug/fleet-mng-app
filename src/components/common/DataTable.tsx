'use client';

import { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (id: string | number | Promise<void> | void) => void;
  onAdd?: () => void;
  itemsPerPage?: number;
  initialSortConfig?: {
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null;
}

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  itemsPerPage = 10,
  initialSortConfig = null,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(initialSortConfig);
  const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => String(col.key)))
  );
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const handleSort = (key: keyof T | string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Filter data based on search term
  const filteredData = data.filter(item => {
    if (!searchTerm.trim()) return true;
    
    // Search across all visible columns
    return columns.some(column => {
      if (!visibleColumns.has(String(column.key))) return false;
      
      const value = column.key in item ? String(item[column.key as keyof T]) : '';
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const sortedData = [...currentData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = sortConfig.key in a ? a[sortConfig.key as keyof T] : '';
    const bValue = sortConfig.key in b ? b[sortConfig.key as keyof T] : '';

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const visibleColumnsList = columns.filter(col => 
    visibleColumns.has(String(col.key))
  );

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="px-4 py-5 sm:p-6">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-150 hover:bg-white focus:bg-white"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Results count */}
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="text-blue-600 font-semibold">{startIndex + 1}</span> to <span className="text-blue-600 font-semibold">{Math.min(endIndex, filteredData.length)}</span> of <span className="text-blue-600 font-semibold">{filteredData.length}</span> results
            </div>

            <div className="flex items-center gap-2">
              {/* Column selector */}
              <div className="relative">
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
                
                {showColumnSelector && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Toggle columns</h3>
                    </div>
                    <div className="p-2 max-h-60 overflow-y-auto">
                      {columns.map(column => (
                        <label key={String(column.key)} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={visibleColumns.has(String(column.key))}
                            onChange={() => toggleColumnVisibility(String(column.key))}
                          />
                          <span className="ml-2 text-sm text-gray-700">{column.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add button - moved outside the previous container to be at the far right */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="group relative px-4 py-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white text-sm font-medium shadow-md transition-all duration-300 hover:shadow-indigo-500/40 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:translate-y-0.5"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 group-hover:animate-gradient-x transition-opacity"></span>
            <span className="relative flex items-center justify-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New
            </span>
          </button>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                {visibleColumnsList.map((column) => (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200/50 transition-colors duration-150 first:rounded-tl-lg last:rounded-tr-lg"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUpIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-blue-600" />
                        )
                      ) : (
                        <div className="h-4 w-4 opacity-0 group-hover:opacity-30">
                          <ChevronUpIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th scope="col" className="relative px-6 py-3.5 bg-gray-50">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`transition-colors duration-150 ${
                      hoveredRow === item.id 
                        ? 'bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {visibleColumnsList.map((column) => (
                      <td
                        key={`${item.id}-${String(column.key)}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(item)
                          : column.key in item
                          ? String(item[column.key as keyof T])
                          : ''}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1.5 hover:bg-blue-100 rounded-full"
                              aria-label="Edit"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1.5 hover:bg-red-100 rounded-full"
                              aria-label="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={visibleColumnsList.length + (onEdit || onDelete ? 1 : 0)} 
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    {searchTerm ? 'No results found' : 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                Previous
              </button>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {totalPages <= 7 ? (
                // Show all pages if 7 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    } transition-colors duration-150`}
                  >
                    {page}
                  </button>
                ))
              ) : (
                // Show limited pages with ellipsis for many pages
                <>
                  {/* First page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    } transition-colors duration-150`}
                  >
                    1
                  </button>
                  
                  {/* Ellipsis or second page */}
                  {currentPage > 3 && (
                    <span className="relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}
                  
                  {/* Pages around current page */}
                  {Array.from(
                    { length: Math.min(3, totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (currentPage <= 2) {
                        pageNum = i + 2; // 2, 3, 4
                      } else if (currentPage >= totalPages - 1) {
                        pageNum = totalPages - 3 + i; // totalPages-2, totalPages-1, totalPages
                      } else {
                        pageNum = currentPage - 1 + i; // currentPage-1, currentPage, currentPage+1
                      }
                      
                      // Only show if within range
                      if (pageNum > 1 && pageNum < totalPages) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 bg-white hover:bg-gray-50'
                            } transition-colors duration-150`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    }
                  ).filter(Boolean)}
                  
                  {/* Ellipsis or second-to-last page */}
                  {currentPage < totalPages - 2 && (
                    <span className="relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}
                  
                  {/* Last page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`relative inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white hover:bg-gray-50'
                    } transition-colors duration-150`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Next
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

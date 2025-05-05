export const commonStyles = {
  // Page Layout
  pageContainer: "space-y-6",
  pageHeader: "flex justify-between items-center mb-6",
  pageTitle: "text-2xl font-bold text-gray-800",
  
  // Add Button
  addButton: `inline-flex items-center px-4 py-2 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white 
              bg-blue-600 hover:bg-blue-700 focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`,
  
  // Form Container
  formContainer: "bg-white rounded-xl shadow-md overflow-hidden",
  formHeader: "px-8 py-6 bg-gradient-to-r from-blue-50 to-white border-b",
  formTitle: "text-xl font-semibold text-gray-800",
  formBody: "p-8 space-y-6",
  
  // Form Fields
  fieldGroup: "space-y-2",
  label: "block text-sm font-medium text-gray-700",
  input: `mt-1 block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm`,
  select: `mt-1 block w-full rounded-md border-gray-300 shadow-sm 
           focus:border-blue-500 focus:ring-blue-500 sm:text-sm`,
  textarea: `w-full px-4 py-2.5 text-base font-medium text-gray-900 bg-white border
             border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 
             focus:border-blue-500 transition-all duration-200`,
  
  // Form Actions
  formActions: "flex justify-end space-x-3 pt-5 border-t border-gray-200",
  cancelButton: `px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                 border-gray-300 rounded-md shadow-sm hover:bg-gray-50 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-blue-500`,
  submitButton: `inline-flex justify-center px-4 py-2 text-sm font-medium 
                 text-white bg-blue-600 border border-transparent rounded-md 
                 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 
                 focus:ring-offset-2 focus:ring-blue-500`,
  
  // Table Styles
  tableContainer: "bg-white shadow sm:rounded-lg overflow-hidden",
  tableCell: "text-sm font-medium text-gray-900",
  tableSecondaryText: "text-sm text-gray-500",
  
  // Loading State
  loadingOverlay: "absolute inset-0 bg-white/75 flex items-center justify-center",
  loadingSpinner: "animate-spin h-5 w-5 text-blue-600",
  formInput: "border border-blue-200 rounded px-3 py-2 flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400",
}; 
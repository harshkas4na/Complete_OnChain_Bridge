const Card = ({ children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
  
  const CardHeader = ({ children, className = "" }) => (
    <div className={`px-4 py-5 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
  
  const CardContent = ({ children, className = "" }) => (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
  
  export { Card, CardHeader,CardContent};
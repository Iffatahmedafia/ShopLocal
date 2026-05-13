import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

// Converts slug-like strings to nicely formatted titles
const formatBreadcrumbName = (value) => {
  return decodeURIComponent(value)
    .replace(/[-_]/g, ' ')                     // Replace hyphens/underscores with space
    .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize each word
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') return null;

  return (
    <nav className="text-sm font-medium text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="flex items-center text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={to} className="flex items-center">
              <span className="text-gray-300 dark:text-gray-600">/</span>
              {isLast ? (
                <span className="text-gray-700 dark:text-gray-200">{formatBreadcrumbName(value)}</span>
              ) : (
                <Link to={to} className="text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  {formatBreadcrumbName(value)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

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
    <nav className="text-md text-gray-500 px-4 py-2">
      <ol className="flex space-x-2 items-center">
        <li>
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-700 dark:text-white">{formatBreadcrumbName(value)}</span>
              ) : (
                <Link to={to} className="text-blue-600 hover:underline">
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

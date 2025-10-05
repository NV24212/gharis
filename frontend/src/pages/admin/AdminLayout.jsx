import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, Video, ClipboardList } from 'lucide-react'; // Using lucide-react for icons

const AdminLayout = () => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-6 px-2">لوحة التحكم</h2>
          <nav className="flex flex-col space-y-2">
            <NavLink to="/admin/students" className={navLinkClasses}>
              <Users className="mr-3 h-5 w-5" />
              إدارة الطلاب
            </NavLink>
            <NavLink to="/admin/weeks" className={navLinkClasses}>
              <Video className="mr-3 h-5 w-5" />
              إدارة الأسابيع
            </NavLink>
            <NavLink to="/admin/classes" className={navLinkClasses}>
              <ClipboardList className="mr-3 h-5 w-5" />
              إدارة الفصول
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
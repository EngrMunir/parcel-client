import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../redux/features/hook';
import { selectCurrentUser } from '../redux/features/auth/authSlice';

const Dashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  console.log('role', user?.role)
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role;

  useEffect(() => {
    if (location.pathname === '/dashboard' && role) {
      if (role === 'ADMIN') {
        navigate('/dashboard/allParcels');
      } else if (role === 'AGENT') {
        navigate('/dashboard/myDeliveryList');
      } else if (role === 'CUSTOMER') {
        navigate('/dashboard/bookParcel');
      }
    }
  }, [role, navigate, location.pathname]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
  {/* Sidebar */}
  <aside className="w-full md:w-64 bg-white shadow-md md:h-screen border-r border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-700">📦 Dashboard</h2>
    </div>
    <ul className="menu px-4 py-6 space-y-2">
      {role === 'CUSTOMER' && (
        <>
          <li>
            <NavLink
              to="/dashboard/bookParcel"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium ${
                  isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                }`
              }
            >
              Book a Parcel
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium ${
                  isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                }`
              }
            >
              My Parcels
            </NavLink>
          </li>
        </>
      )}

      {role === 'AGENT' && (
        <li>
          <NavLink
            to="/dashboard/myDeliveryList"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium ${
                isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
              }`
            }
          >
            My Delivery List
          </NavLink>
        </li>
      )}

      {role === 'ADMIN' && (
        <>
          <li>
            <NavLink
              to="/dashboard/allParcels"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium ${
                  isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                }`
              }
            >
              All Parcels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/allUser"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium ${
                  isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
                }`
              }
            >
              All Users
            </NavLink>
          </li>
        </>
      )}

      <div className="border-t pt-4 mt-4">
        <li>
          <Link
            to="/"
            className="block px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
        </li>
      </div>
    </ul>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-6">
    <Outlet />
  </main>
</div>

  );
};

export default Dashboard;

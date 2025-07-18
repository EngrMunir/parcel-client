import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../redux/features/hook';
import { selectCurrentUser } from '../redux/features/auth/authSlice';
import { useGetSingleUserQuery } from '../redux/features/user/userApi';

const Dashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();

  // fallback if no user is logged in
  const email = user?.email;
  const {
    data: loggedUser,
    isLoading,
    isError,
  } = useGetSingleUserQuery(email, { skip: !email });

  const role = loggedUser?.data?.role;

  // Role-based redirection
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

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !role) return <p className="text-center mt-10 text-red-500">Failed to load user role</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-64 min-h-full bg-orange-400">
        <ul className="menu p-4 text-white">
          {role === 'CUSTOMER' && (
            <>
              <li><NavLink to="/dashboard/bookParcel">Book a Parcel</NavLink></li>
              <li><NavLink to="/dashboard/myParcels">My Parcels</NavLink></li>
            </>
          )}
          {role === 'AGENT' && (
            <>
              <li><NavLink to="/dashboard/myDeliveryList">My Delivery List</NavLink></li>
            </>
          )}
          {role === 'ADMIN' && (
            <>
              <li><NavLink to="/dashboard/allParcels">All Parcels</NavLink></li>
              <li><NavLink to="/dashboard/allUser">All Users</NavLink></li>
            </>
          )}
          <div className="divider"></div>
          <li><Link to="/">Home</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

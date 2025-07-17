import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Welcome to FastParcel
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Book, track, and manage your courier parcels with ease. Whether you're a business or individual—FastParcel has you covered.
        </p>

        <div className="flex justify-center gap-4 mb-12">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left text-gray-700">
          <div className="p-4 border rounded-md shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
            <p>Send parcels nationwide with just a few clicks.</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Real-Time Tracking</h3>
            <p>Track your parcel's journey live from pickup to delivery.</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">Agent Dashboard</h3>
            <p>Agents can manage bookings, deliveries, and reports easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { FaEdit } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/features/hook";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import {
  useCancelParcelMutation,
  useGetCustomerParcelsQuery,
} from "../../../redux/features/parcel/parcelApi";

const CustomerParcels = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: myParcels = [], isLoading, isError } = useGetCustomerParcelsQuery(user?.id);
  const [cancelParcel] = useCancelParcelMutation();

  const handleCancel = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will cancel the parcel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        await cancelParcel({ parcelId: id, status: "cancelled" }).unwrap();
        Swal.fire("Cancelled", "Your parcel has been cancelled.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to cancel parcel.", "error");
      }
    }
  };

  if (isLoading) return <p className="text-center mt-6">Loading parcels...</p>;
  if (isError) return <p className="text-center mt-6 text-red-500">Failed to load parcels.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">📦 My Parcels ({myParcels.length})</h2>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Pickup</th>
              <th className="px-4 py-3 text-left">Delivery</th>
              <th className="px-4 py-3 text-left">Receiver</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Booked On</th>
              <th className="px-4 py-3 text-center">Edit</th>
              <th className="px-4 py-3 text-center">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {myParcels.map((parcel) => (
              <tr
                key={parcel.id}
                className="border-t hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 py-2">{parcel.type}</td>
                <td className="px-4 py-2">{parcel.size}</td>
                <td className="px-4 py-2">{parcel.pickupAddress}</td>
                <td className="px-4 py-2">{parcel.deliveryAddress}</td>
                <td className="px-4 py-2">{parcel.receiverName}</td>
                <td className="px-4 py-2">{parcel.paymentType}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      parcel.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : parcel.status === "delivered"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(parcel.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <Link to={`/dashboard/update/${parcel.id}`}>
                    <FaEdit className="text-xl text-blue-600 hover:text-blue-800" />
                  </Link>
                </td>
                <td className="px-4 py-2 text-center">
                  {parcel.status === "cancelled" || parcel.status === "delivered" ? (
                    <MdOutlineCancelPresentation className="text-xl text-gray-400 cursor-not-allowed" />
                  ) : (
                    <button onClick={() => handleCancel(parcel.id)} title="Cancel Parcel">
                      <MdOutlineCancelPresentation className="text-xl text-red-600 hover:text-red-800" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerParcels;

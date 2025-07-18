import Swal from "sweetalert2";
import { useAppSelector } from "../../../redux/features/hook";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import {
  useGetParcelsByAgentQuery,
  useUpdateParcelStatusMutation,
} from "../../../redux/features/parcel/parcelApi";

const MyDeliveryList = () => {
  const user = useAppSelector(selectCurrentUser);

  const { data: deliveryListsParcels = [], isLoading } = useGetParcelsByAgentQuery(user?.id, {
    skip: !user?.id,
  });

  const [updateParcelStatus] = useUpdateParcelStatusMutation();

  const handleStatusUpdate = async (id: string, status: string) => {
    const confirm = await Swal.fire({
      title: `Mark as ${status.replace("_", " ")}?`,
      text: `Are you sure you want to update the status to "${status}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
    });

    if (confirm.isConfirmed) {
      try {
        await updateParcelStatus({ id, status }).unwrap();
        Swal.fire("Success!", `Status updated to ${status}.`, "success");
      } catch (err) {
        Swal.fire("Error!", "Status update failed.", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">📦 My Delivery List</h2>
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="p-3">Sender</th>
              <th className="p-3">Receiver</th>
              <th className="p-3">Pickup</th>
              <th className="p-3">Delivery</th>
              <th className="p-3">Size</th>
              <th className="p-3">Type</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryListsParcels.map((parcel: any, index: number) => (
              <tr
                key={parcel.id}
                className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="p-3">
                  <div className="font-medium">{parcel.sender?.name}</div>
                  <div className="text-xs text-gray-500">{parcel.sender?.email}</div>
                </td>
                <td className="p-3">{parcel.receiverName}</td>
                <td className="p-3">{parcel.pickupAddress}</td>
                <td className="p-3">{parcel.deliveryAddress}</td>
                <td className="p-3">{parcel.size}</td>
                <td className="p-3">{parcel.type}</td>
                <td className="p-3">{parcel.paymentType}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parcel.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : parcel.status?.includes("CANCELLED") || parcel.status === "FAILED"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="p-3 flex flex-col gap-1 items-center">
                  <button
                    disabled={parcel.status === "PICKED_UP"}
                    onClick={() => handleStatusUpdate(parcel.id, "PICKED_UP")}
                    className="text-blue-500 text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Picked Up
                  </button>
                  <button
                    disabled={parcel.status === "IN_TRANSIT"}
                    onClick={() => handleStatusUpdate(parcel.id, "IN_TRANSIT")}
                    className="text-yellow-600 text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    In Transit
                  </button>
                  <button
                    disabled={parcel.status === "DELIVERED"}
                    onClick={() => handleStatusUpdate(parcel.id, "DELIVERED")}
                    className="text-green-600 text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delivered
                  </button>
                  <button
                    disabled={parcel.status === "FAILED"}
                    onClick={() => handleStatusUpdate(parcel.id, "FAILED")}
                    className="text-red-600 text-xs hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Failed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isLoading && <p className="text-center p-4">Loading...</p>}

        {!isLoading && deliveryListsParcels.length === 0 && (
          <p className="text-center p-4 text-gray-500">No deliveries found.</p>
        )}
      </div>
    </div>
  );
};

export default MyDeliveryList;

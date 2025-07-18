import { MdCancelPresentation, MdCheckCircleOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { useAppSelector } from "../../../redux/features/hook";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import {
  useCancelDeliveryParcelMutation,
  useCancelParcelMutation,
  useGetParcelsByAgentQuery,
} from "../../../redux/features/parcel/parcelApi";

const MyDeliveryList = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: deliveryListsParcels = [], isLoading } = useGetParcelsByAgentQuery(user?.id, {
    skip: !user?.id,
  });

  const [cancelParcel] = useCancelParcelMutation();
  const [deliverParcel] = useCancelDeliveryParcelMutation();

  const handleCancel = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await cancelParcel({ parcelId: id, status: "Cancelled by delivery men" }).unwrap();
        if (res?.modifiedCount) {
          Swal.fire("Cancelled!", "Your parcel has been cancelled.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Cancellation failed.", "error");
      }
    }
  };

  const handleDeliver = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Mark this parcel as delivered?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, deliver it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await deliverParcel({ parcelId: id, status: "Delivered" }).unwrap();
        if (res?.modifiedCount) {
          Swal.fire("Delivered!", "Parcel marked as delivered.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Delivery failed.", "error");
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
                      parcel.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : parcel.status?.includes("Cancelled")
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleCancel(parcel.id)}
                    title="Cancel Parcel"
                    className="hover:text-red-600 transition"
                  >
                    <MdCancelPresentation className="text-2xl" />
                  </button>
                  <button
                    onClick={() => handleDeliver(parcel.id)}
                    title="Mark as Delivered"
                    className="hover:text-green-600 transition"
                  >
                    <MdCheckCircleOutline className="text-2xl" />
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

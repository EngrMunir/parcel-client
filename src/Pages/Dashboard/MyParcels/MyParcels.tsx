import { FaEdit } from "react-icons/fa";
import { MdOutlineCancelPresentation } from "react-icons/md";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/features/hook";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import {
  useCancelParcelMutation,
  useGetMyParcelsQuery,
} from "../../../redux/features/parcel/parcelApi";

const MyParcels = () => {
  const { user } = useAppSelector(selectCurrentUser);

  const { data: myParcels = [] } = useGetMyParcelsQuery(user?.email);
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

  return (
    <div>
      <h2 className="text-3xl text-center">My Parcels: {myParcels?.length}</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Parcel Type</th>
              <th>Requested Delivery</th>
              <th>Approx. Delivery</th>
              <th>Booking Date</th>
              <th>Delivery Men ID</th>
              <th>Status</th>
              <th>Update</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {myParcels.map((parcel) => (
              <tr className="bg-base-200" key={parcel._id}>
                <td>{parcel.parcelType}</td>
                <td>{parcel.requestedDeliveryDate}</td>
                <td>{parcel.approximateDeliveryDate}</td>
                <td>{parcel.bookingDate}</td>
                <td>{parcel.deliveryMenId}</td>
                <td>{parcel.status}</td>
                <td>
                  <Link to={`/dashboard/update/${parcel._id}`}>
                    <FaEdit className="text-3xl text-blue-500" />
                  </Link>
                </td>
                <td>
                  <button onClick={() => handleCancel(parcel._id)}>
                    <MdOutlineCancelPresentation className="text-3xl text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;

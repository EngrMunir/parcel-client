import { MdOutlineCancelPresentation } from "react-icons/md";
import Swal from "sweetalert2";
import { useAppSelector } from "../../../redux/features/hook";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import { useCancelDeliveryParcelMutation, useCancelParcelMutation, useGetMyDeliveryListQuery } from "../../../redux/features/parcel/parcelApi";


const MyDeliveryList = () => {
  const { user } = useAppSelector(selectCurrentUser);

  const { data: deliveryListsParcels = [], isLoading } = useGetMyDeliveryListQuery(user?.email || "", {
    skip: !user?.email,
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
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deliver it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await deliverParcel({ parcelId: id, status: "Delivered" }).unwrap();
        if (res?.modifiedCount) {
          Swal.fire("Delivered!", "Parcel has been delivered.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Delivery failed.", "error");
      }
    }
  };

  return (
    <div>
      <h2 className="text-center text-xl font-bold my-4">My Delivery List</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Sender Name</th>
              <th>Receiver Name</th>
              <th>Sender Phone</th>
              <th>Requested Delivery Date</th>
              <th>Approx. Delivery Date</th>
              <th>Receiver Phone</th>
              <th>Receiver Address</th>
              <th>View Location</th>
              <th>Cancel</th>
              <th>Deliver</th>
            </tr>
          </thead>
          <tbody>
            {deliveryListsParcels.map((parcel: any) => (
              <tr key={parcel._id} className="bg-base-200">
                <td>{parcel.name}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.phone}</td>
                <td>{parcel.requestedDeliveryDate}</td>
                <td>{parcel.approximateDeliveryDate}</td>
                <td>{parcel.receiverPhoneNumber}</td>
                <td>{parcel.receiverAddress}</td>
                <td>Location</td>
                <td>
                  <button onClick={() => handleCancel(parcel._id)}>
                    <MdOutlineCancelPresentation className="text-3xl text-red-500" />
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeliver(parcel._id)}>
                    <MdOutlineCancelPresentation className="text-3xl text-green-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="text-center mt-4">Loading...</p>}
      </div>
    </div>
  );
};

export default MyDeliveryList;

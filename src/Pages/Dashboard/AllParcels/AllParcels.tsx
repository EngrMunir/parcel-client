import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { MdManageAccounts } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import { useAssignAgentMutation, useGetAllDeliveryMenQuery, useGetAllParcelsQuery } from '../../../redux/features/parcel/parcelApi';


const AllParcels = () => {
  const user = useSelector(selectCurrentUser);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

  const { data: parcelData, refetch } = useGetAllParcelsQuery(undefined);
  const allParcels = parcelData?.data || [];

  const { data: deliveryMenData } = useGetAllDeliveryMenQuery(undefined);
  const deliveryMen = deliveryMenData?.data || [];

  const [assignAgent] = useAssignAgentMutation();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    if (!selectedParcelId) return;

    try {
      await assignAgent({
        id: selectedParcelId,
        agentId: data.deliveryMenId,
      }).unwrap();

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Agent assigned successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      reset();
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to assign agent', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-3xl text-center">All Parcels</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Sender Name</th>
              <th>Pickup Address</th>
              <th>Delivery Address</th>
              <th>Size</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {allParcels.map((parcel: any) => (
              <tr key={parcel.id}>
                <td>{parcel.sender?.name}</td>
                <td>{parcel.pickupAddress}</td>
                <td>{parcel.deliveryAddress}</td>
                <td>{parcel.size}</td>
                <td>{parcel.status}</td>
                <td>
                  <button
                    className="btn text-slate-400"
                    onClick={() => {
                      setSelectedParcelId(parcel.id);
                      document.getElementById('my_modal_5')?.showModal();
                    }}
                  >
                    <MdManageAccounts className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="font-bold text-lg py-4">Assign Delivery Agent</h2>
            <select {...register('deliveryMenId', { required: true })} className="select select-bordered w-full mb-4">
              <option value="">Select Agent</option>
              {deliveryMen.map((man: any) => (
                <option value={man.id} key={man.id}>
                  {man.name}
                </option>
              ))}
            </select>
            <input type="submit" value="Assign" className="btn btn-sm btn-secondary" />
          </form>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AllParcels;

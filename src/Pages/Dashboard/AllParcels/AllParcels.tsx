import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { MdManageAccounts } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import {
  useAssignAgentMutation,
  useGetAllParcelsQuery,
} from '../../../redux/features/parcel/parcelApi';
import { useGetAllAgentQuery } from '../../../redux/features/user/userApi';

const AllParcels = () => {
  const user = useSelector(selectCurrentUser);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);

  const { data: parcelData, refetch } = useGetAllParcelsQuery(undefined);
  const allParcels = parcelData?.data || [];

  const { data: agentData } = useGetAllAgentQuery(undefined);
  const agents = agentData?.data || [];

  const [assignAgent] = useAssignAgentMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!selectedParcelId) return;

    try {
      await assignAgent({
        id: selectedParcelId,
        agentId: data.agentId,
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
      (document.getElementById('my_modal_5') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to assign agent', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">📦 All Parcels</h2>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Sender</th>
              <th className="px-4 py-3 text-left">Pickup</th>
              <th className="px-4 py-3 text-left">Delivery</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Assign</th>
            </tr>
          </thead>
          <tbody>
            {allParcels.map((parcel: any) => (
              <tr key={parcel.id} className="border-t hover:bg-gray-50 transition duration-200">
                <td className="px-4 py-2">{parcel.sender?.name || 'N/A'}</td>
                <td className="px-4 py-2">{parcel.pickupAddress}</td>
                <td className="px-4 py-2">{parcel.deliveryAddress}</td>
                <td className="px-4 py-2">{parcel.size}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      parcel.status === 'cancelled'
                        ? 'bg-red-100 text-red-600'
                        : parcel.status === 'delivered'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 transition"
                    onClick={() => {
                      setSelectedParcelId(parcel.id);
                      (document.getElementById('my_modal_5') as HTMLDialogElement)?.showModal();
                    }}
                    title="Assign Agent"
                  >
                    <MdManageAccounts className="text-xl mx-auto" />
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
            <h3 className="text-xl font-semibold mb-4">Assign Agent</h3>

            <div className="mb-4">
              <select
                {...register('agentId', { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Agent</option>
                {agents.map((agent: any) => (
                  <option value={agent.id} key={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
              {errors.agentId && (
                <p className="text-red-500 text-sm mt-1">Please select an agent.</p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <input type="submit" value="Assign" className="btn btn-primary" />
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AllParcels;

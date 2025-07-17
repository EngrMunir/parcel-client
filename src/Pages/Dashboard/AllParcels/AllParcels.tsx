import { useState } from 'react';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { MdManageAccounts } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../../hook/useAuth';

const AllParcels = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcelId, setSelectedParcelId]=useState(null);
    const { user } = useAuth();

    const { register,handleSubmit } = useForm()
    const { data: allParcels=[], refetch } = useQuery({
        queryKey:['parcels'],
        queryFn: async()=>{
            const res = await axiosSecure.get('/bookParcel')
            console.log(res.data)
            return res.data;
        }
    })
    const { data: deliveryMen=[] } = useQuery({
        queryKey:['deliveryMen'],
        queryFn: async()=>{
            const res = await axiosSecure.get('/deliveryMen',{credentials:'include'})
            console.log(res.data)
            return res.data;
        }
    })

    const onSubmit = async(data) =>{
        console.log('id',data.deliveryMenId)
        const assignInfo={deliveryMenId:data.deliveryMenId, approximateDeliveryDate:data.approximateDeliveryDate, parcelId:selectedParcelId}
        const result = await axiosSecure.patch('/assignDeliveryMen',assignInfo);
        if(result.data.modifiedCount>0){
            Swal.fire({
                position: "top-right",
                icon: "success",
                title: "Delivery Men assigned",
                showConfirmButton: false,
                timer: 1500
              });
              refetch();
        }
    }
    return (
        <div>
            <h2 className='text-3xl text-center'>All Parcel</h2>
            <div className="overflow-x-auto">
                <table className="table">
                {/* head */}
                    <thead>
                        <tr>
                            <th>Sender Name</th>
                            <th>Sender Phone</th>
                            <th>Booking Date</th>
                            <th>Requested <br />Delivery Date</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Manage Button</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                    allParcels.map(parcel =>
                        (
                            <tr key={parcel._id}>
                            <td>{parcel.name}</td>
                            <td>{parcel.phone}</td>
                            <td>{parcel.bookingDate}</td>
                            <td>{parcel.requestedDeliveryDate}</td>
                            <td>{parcel.price}</td>
                            <td>{parcel.status}</td>
                            <td> <button className="btn text-slate-400" 
                            onClick={()=>{setSelectedParcelId(parcel._id); 
                            document.getElementById('my_modal_5').showModal()}}><MdManageAccounts className='text-3xl'/></button></td>
                        </tr>
                        )
                    ) }
                    </tbody>
                </table>
            </div>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
               
                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="font-bold text-lg py-4">Approximate Delivery Date</h2>
                        <input {...register('approximateDeliveryDate',{required:true})} type="date" /><br />
                        <h2 className="font-bold text-lg py-4">Assign DeliveryMen</h2>
                        <select {...register('deliveryMenId',{required:true})}>
                            {
                                deliveryMen.map(man =>(<option value={man._id} key={man._id}>{man.name}</option>))
                            }           
                        </select> 
                        <input type="submit" value="Assign" className='btn btn-sm btn-secondary ml-5'/>                       
                    </form> 
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                    </form>
                    </div>
                </div>
                </dialog>
        </div>
    );
};

export default AllParcels;
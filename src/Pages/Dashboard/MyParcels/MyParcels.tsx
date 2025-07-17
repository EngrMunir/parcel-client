import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { FaEdit } from "react-icons/fa";
import { MdOutlineCancelPresentation, MdOutlineDeleteOutline, MdOutlinePayments, MdOutlineRateReview } from "react-icons/md";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";

const MyParcels = () => {

    const axiosSecure = useAxiosSecure();
    const { register,handleSubmit } = useForm()
    const { user } = useAuth();
    const [selectedDeliveryMenId, setSelectedDeliveryMenId]=useState('');
    console.log(user)

    const { data: myParcels=[], refetch } = useQuery({
        queryKey:['parcels'],
        queryFn: async()=>{
            const res = await axiosSecure.get(`/bookParcel?email=${user.email}`)
            return res.data;
        }
    })

    const onSubmit = async(data) =>{
      const date = new Date();
      const feedbackDate = format(date, 'yyyy-MM-dd');
      const feedbackInfo={user_name:data.user_name, user_image:data.user_image,
      rating:parseInt(data.rating),feedback:data.feedback,deliveryMenId:data.deliveryMenId, feedbackDate}
      const result = await axiosSecure.post('/feedback',feedbackInfo);
      console.log(result)
      if(result.data.insertedId){
          Swal.fire({
              position: "top-right",
              icon: "success",
              title: "Feedback submitted successfully",
              showConfirmButton: false,
              timer: 1500
            });
            refetch();
      }
  }

    const handleCancel=async(id)=>{
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
          const cancelInfo = {
            parcelId: id,
            status:'cancelled'
          }
          const res = await axiosSecure.patch('/bookParcel/cancel',cancelInfo)
          if(res.data.modifiedCount){
            refetch()
            Swal.fire({
              title: "Cancelled!",
              text: "Your file has been canceled.",
              icon: "success"
            });
          }
        }
      });
    }
    return (
        <div>
            <h2 className="text-3xl text-center">My Parcels:{myParcels?.length}</h2>
            <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Parcel Type</th>
                      <th>Requested <br /> Delivery Date</th>
                      <th>Approximate <br /> Delivery Date</th>
                      <th>Booking Date</th>
                      <th>Delivery Men Id</th>
                      <th>Status</th>
                      <th>Update</th>
                      <th>Cancel</th>
                      <th>Review</th>
                      <th>Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      myParcels.map(parcel =><tr className="bg-base-200" key={parcel._id}>
                          <td>{parcel.parcelType}</td>
                          <td>{parcel.requestedDeliveryDate}</td>
                          <td>{parcel.approximateDeliveryDate}</td>
                          <td>{parcel.bookingDate}</td>
                          <th>{parcel.deliveryMenId}</th>
                          <td>{parcel.status}</td>
                          <td><Link to={`/dashboard/update/${parcel._id}`}><FaEdit className="text-3xl text-blue-500" /></Link></td>
                          <td><button onClick={()=>handleCancel(parcel._id)}><MdOutlineCancelPresentation className="text-3xl text-red-500"/> </button></td>
                          <td> <button onClick={()=>{setSelectedDeliveryMenId(parcel.deliveryMenId);
                            document.getElementById('my_modal_5').showModal()}}><MdOutlineRateReview className="text-3xl text-blue-500"/></button></td>
                          <td><Link to={`/payment/${parcel._id}`} state={{parcel}} ><MdOutlinePayments className="text-3xl text-blue-500"/></Link></td>  
                        </tr>)
                  }
                  </tbody>
                </table>
              </div>

               {/* Open the modal using document.getElementById('ID').showModal() method */} 
               <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="font-bold text-lg py-4">User Name</h2>
                        <input {...register('user_name',{required:true})} type="text" defaultValue={user.displayName} readOnly /><br />
                        <h2 className="font-bold text-lg py-4">User Image</h2>
                        <input {...register('user_image',{required:true})} type="text" readOnly defaultValue={user.photoURL}/><br />
                        <h2 className="font-bold text-lg py-4">Ratings</h2>
                        <select name="" id="" {...register('rating',{required:true})}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>          
                        </select>
                        <h2 className="font-bold text-lg py-4">Feedback</h2>
                        <input {...register('feedback',{required:true})} type="text" className="border-2"/><br /> 
                        <h2 className="font-bold text-lg py-4">Delivery Men ID</h2>
                        <input {...register('deliveryMenId',{required:true})} type="text" defaultValue={selectedDeliveryMenId} readOnly/><br /> 
                        <input type="submit" value="Submit" className='btn btn-sm btn-secondary ml-5'/>                       
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

export default MyParcels;
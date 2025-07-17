import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { MdOutlineCancelPresentation } from "react-icons/md";
import Swal from "sweetalert2";

const MyDeliveryList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  
  const { data: deliveryListsParcels=[], isLoading, refetch }= useQuery({
    queryKey:['deliveryListsParcel'],
    queryFn: async ()=>{
        const res = await axiosSecure.get(`/myDeliveryList?email=${user.email}`);
        console.log(res.data)
        return res.data;
    }
})


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
        status:'Cancelled by delivery men'
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
const handleDeliver=async(id)=>{
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Deliver it!"
  }).then(async(result) => {
    if (result.isConfirmed) {
      const cancelInfo = {
        parcelId: id,
        status:'Delivered'
      }
      const res = await axiosSecure.patch('/bookParcel/cancel',cancelInfo)
      if(res.data.modifiedCount){
        refetch()
        Swal.fire({
          title: "Delivered!",
          text: "Parcel has been delivered.",
          icon: "success"
        });
      }
    }
  });
}

    return (
        <div>
            <h2 className="text-center">My Delivery List</h2>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Sender Name</th>
                    <th>Receiver Name</th>
                    <th>Sender Phone</th>
                    <th>Requested <br /> Delivery Date</th>
                    <th>Approximate <br /> Delivery Date</th>
                    <th>Receiver <br />Phone Number</th>
                    <th>Receiver <br /> Address</th>
                    <th>View Location</th>
                    <th>Cancel</th>
                    <th>Deliver</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    deliveryListsParcels.map(parcel =><tr className="bg-base-200" key={parcel._id}>
                        <td>{parcel.name}</td>
                        <td>{parcel.receiverName}</td>
                        <td>{parcel.phone}</td>
                        <td>{parcel.requestedDeliveryDate}</td>
                        <th>{parcel.approximateDeliveryDate}</th>
                        <td>{parcel.receiverPhoneNumber}</td>
                        <td>{parcel.receiverAddress}</td>
                        <td>Location</td>
                        <td><button onClick={()=>handleCancel(parcel._id)}><MdOutlineCancelPresentation className="text-3xl text-red-500"/> </button></td>
                        <td><button onClick={()=>handleDeliver(parcel._id)}><MdOutlineCancelPresentation className="text-3xl text-red-500"/> </button></td>  
                      </tr>)
                }
                </tbody>
              </table>
            </div>
        </div>
    );
};

export default MyDeliveryList;
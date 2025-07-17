import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hook/useAxiosPublic";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useEffect } from "react";
import useAuth from "../../../hook/useAuth";

const BookAParcel = () => {
    const { register,handleSubmit, formState: { errors },reset, setValue, watch} = useForm();
    const { user } = useAuth();
    // console.log(user)
    const axiosPublic = useAxiosPublic();

    const parcelWeight = watch('parcelWeight', 0);

    useEffect(() => {
        const totalPrice = calculatePrice(parcelWeight);
        setValue('price', totalPrice);
    }, [parcelWeight, setValue]);

    const calculatePrice=(weight)=>{
        if(weight<=2){
            return weight*50;
        }else{
            return 150;
        }
    }

    const onSubmit = async(data) =>{
        const totalPrice = calculatePrice(data.parcelWeight)
        setValue('price', totalPrice);
        const date = new Date();
        const bookingDate = format(date, 'yyyy-MM-dd');
        const parcelInfo ={...data, bookingDate, status:'pending'};
        console.log(parcelInfo)
        const bookedParcel = await axiosPublic.post('/bookParcel', parcelInfo);
        if(bookedParcel.data.insertedId){
            Swal.fire({
                title:'Congratulations',
                text:'Parcel booked success',
                icon:"success"
            })
            reset();
        }
    }

    return (
        <div className="bg-[#F4F3F0] p-20 mb-8">
            <h2 className="text-3xl text-center mb-5">Add A Parcel</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* name and email */}
                <div className="md:flex gap-3 mb-8">
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('name', {required:true})} defaultValue={user?.displayName} className="input input-bordered w-full" readOnly/>
                            {
                                errors.name && <span className="text-red-500">Name is required</span>
                            }
                        </label>
                    </div>
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('email', {required:true})} defaultValue={user.email} readOnly className="input input-bordered w-full"/>
                            {
                                errors.name && <span className="text-red-500">Email is required</span>
                            }
                        </label>
                    </div>
                </div>
                {/* phone number and parcel type */}
                <div className="md:flex gap-3 mb-8">
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('phone', {required:true})} placeholder="Phone Number" className="input input-bordered w-full"/>
                            {
                                errors.name && <span className="text-red-500">Phone number is required</span>
                            }
                        </label>
                    </div>
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Parcel Type</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('parcelType', {required:true})} placeholder="Parcel Type" className="input input-bordered w-full"/>
                            {
                                errors.parcelType && <span className="text-red-500">Parcel Type is required</span>
                            }
                        </label>
                    </div>
                </div>
                {/* Parcel weight and Receiver Name */}
                <div className="md:flex gap-3 mb-8">
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Parcel Weight</span>
                        </label>
                        <label className="input-group">
                            <input type="number" {...register('parcelWeight', {required:true})} placeholder="Parcel Weight in kg" className="input input-bordered w-full"/>
                            {
                                errors.parcelWeight && <span className="text-red-500">Parcel Weight is required</span>
                            }
                        </label>
                    </div>
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Receiver Name</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('receiverName', {required:true})} placeholder="Receiver Name" className="input input-bordered w-full"/>
                            {
                                errors.name && <span className="text-red-500">Receiver Name is required</span>
                            }
                        </label>
                    </div>
                </div>
                {/* receiver phone number and receiver address */}
                <div className="md:flex gap-3 mb-8">
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Receiver's Phone Number</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('receiverPhoneNumber', {required:true})} placeholder="Receiver Phone Number" className="input input-bordered w-full"/>
                            {
                                errors.receiverPhoneNumber && <span className="text-red-500">Receiver Phone number is required</span>
                            }
                        </label>
                    </div>
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Receiver Address</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('receiverAddress', {required:true})} placeholder="Receiver Address" className="input input-bordered w-full"/>
                            {
                                errors.receiverAddress && <span className="text-red-500">Receiver Address is required</span>
                            }
                        </label>
                    </div>
                </div>
                {/* Requested Delivery date and Delivery Address Latitude */}
                <div className="md:flex gap-3 mb-8">
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Requested Delivery Date</span>
                        </label>
                        <label className="input-group">
                            <input type="date" {...register('requestedDeliveryDate', {required:true})} placeholder="Requested Delivery Date" className="input input-bordered w-full"/>
                            {
                                errors.requestedDeliveryDate && <span className="text-red-500">Requested Delivery Date is required</span>
                            }
                        </label>
                    </div>
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Delivery Address Latitude</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('latitude', {required:true})} placeholder="Delivery Address Latitude" className="input input-bordered w-full"/>
                            {
                                errors.name && <span className="text-red-500">Delivery Address Latitude is required</span>
                            }
                        </label>
                    </div>
                </div>
                {/* longitude and Price */}
                <div className="md:flex gap-3 mb-8">
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Delivery Address Longitude</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('longitude', {required:true})} placeholder="Delivery Address Longitude" className="input input-bordered w-full"/>
                            {
                                errors.longitude && <span className="text-red-500">Longitude is required</span>
                            }
                        </label>
                    </div>
                    <div className="form-control md:w-1/2">
                        <label className="label">
                            <span className="label-text">Price</span>
                        </label>
                        <label className="input-group">
                            <input type="text" {...register('price', {required:true})} placeholder="Price" className="input input-bordered w-full"/>
                            {
                                errors.price && <span className="text-red-500">Price is required</span>
                            }
                        </label>
                    </div>
                </div>
                <div className="text-center">
                <input className="btn btn-secondary w-1/3" type="submit" value="Submit" />
                </div>
            </form>            
        </div>
    );
};

export default BookAParcel;
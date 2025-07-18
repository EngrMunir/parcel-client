import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useEffect } from "react";
import { useAppSelector } from "../../../redux/features/hook";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import { useCreateParcelMutation } from "../../../redux/features/parcel/parcelApi";

const BookAParcel = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const { user } = useAppSelector(selectCurrentUser)
  const parcelWeight = watch('parcelWeight', 0);

  const [createParcel] = useCreateParcelMutation();

  const calculatePrice = (weight: number) => {
    if (weight <= 2) return weight * 50;
    return 150;
  };

  useEffect(() => {
    const totalPrice = calculatePrice(parcelWeight);
    setValue('price', totalPrice);
  }, [parcelWeight, setValue]);

  const onSubmit = async (data: any) => {
    const bookingDate = format(new Date(), 'yyyy-MM-dd');
    const totalPrice = calculatePrice(data.parcelWeight);
    const parcelInfo = {
      ...data,
      bookingDate,
      price: totalPrice,
      status: 'PENDING',
    };

    try {
      await createParcel(parcelInfo).unwrap();
      Swal.fire({
        title: 'Congratulations',
        text: 'Parcel booked successfully!',
        icon: 'success',
      });
      reset();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: error?.data?.message || 'Booking failed!',
        icon: 'error',
      });
    }
  };

  return (
    <div className="bg-[#F4F3F0] p-10 mb-8">
      <h2 className="text-3xl text-center mb-5">Book A Parcel</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* name and email */}
        <div className="md:flex gap-3 mb-8">
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Name</span></label>
            <input type="text" {...register('name')} defaultValue={user?.displayName} className="input input-bordered w-full" readOnly />
          </div>
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Email</span></label>
            <input type="email" {...register('email')} defaultValue={user?.email} className="input input-bordered w-full" readOnly />
          </div>
        </div>

        {/* phone number and parcel type */}
        <div className="md:flex gap-3 mb-8">
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Phone Number</span></label>
            <input type="text" {...register('phone', { required: true })} placeholder="Phone Number" className="input input-bordered w-full" />
            {errors.phone && <span className="text-red-500">Phone number is required</span>}
          </div>
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Parcel Type</span></label>
            <input type="text" {...register('parcelType', { required: true })} placeholder="Parcel Type" className="input input-bordered w-full" />
            {errors.parcelType && <span className="text-red-500">Parcel type is required</span>}
          </div>
        </div>

        {/* weight and receiver name */}
        <div className="md:flex gap-3 mb-8">
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Parcel Weight (kg)</span></label>
            <input type="number" step="0.1" {...register('parcelWeight', { required: true })} placeholder="Weight" className="input input-bordered w-full" />
            {errors.parcelWeight && <span className="text-red-500">Weight is required</span>}
          </div>
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Receiver Name</span></label>
            <input type="text" {...register('receiverName', { required: true })} placeholder="Receiver Name" className="input input-bordered w-full" />
            {errors.receiverName && <span className="text-red-500">Receiver name is required</span>}
          </div>
        </div>

        {/* receiver phone and address */}
        <div className="md:flex gap-3 mb-8">
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Receiver Phone</span></label>
            <input type="text" {...register('receiverPhoneNumber', { required: true })} placeholder="Receiver Phone" className="input input-bordered w-full" />
            {errors.receiverPhoneNumber && <span className="text-red-500">Phone is required</span>}
          </div>
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Receiver Address</span></label>
            <input type="text" {...register('receiverAddress', { required: true })} placeholder="Address" className="input input-bordered w-full" />
            {errors.receiverAddress && <span className="text-red-500">Address is required</span>}
          </div>
        </div>

        {/* delivery date and lat */}
        <div className="md:flex gap-3 mb-8">
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Requested Delivery Date</span></label>
            <input type="date" {...register('requestedDeliveryDate', { required: true })} className="input input-bordered w-full" />
            {errors.requestedDeliveryDate && <span className="text-red-500">Date is required</span>}
          </div>
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Latitude</span></label>
            <input type="text" {...register('latitude', { required: true })} placeholder="Latitude" className="input input-bordered w-full" />
            {errors.latitude && <span className="text-red-500">Latitude is required</span>}
          </div>
        </div>

        {/* long and price */}
        <div className="md:flex gap-3 mb-8">
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Longitude</span></label>
            <input type="text" {...register('longitude', { required: true })} placeholder="Longitude" className="input input-bordered w-full" />
            {errors.longitude && <span className="text-red-500">Longitude is required</span>}
          </div>
          <div className="form-control md:w-1/2">
            <label className="label"><span className="label-text">Price</span></label>
            <input type="text" {...register('price')} readOnly className="input input-bordered w-full" />
          </div>
        </div>

        <div className="text-center">
          <input className="btn btn-secondary w-1/3" type="submit" value="Book Parcel" />
        </div>
      </form>
    </div>
  );
};

export default BookAParcel;

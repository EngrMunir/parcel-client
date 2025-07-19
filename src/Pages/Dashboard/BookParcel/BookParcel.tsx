import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useCreateParcelMutation } from "../../../redux/features/parcel/parcelApi";

const BookAParcel = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [createParcel] = useCreateParcelMutation();

  const onSubmit = async (data: any) => {
    const payload = {
      receiverName: data.receiverName,
      pickupAddress: data.pickupAddress,
      deliveryAddress: data.deliveryAddress,
      size: data.size,
      type: data.type,
      paymentType: data.paymentType,
    };

    try {
      await createParcel(payload).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Parcel booked successfully!',
        icon: 'success',
      });
      reset();
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error?.data?.message || 'Booking failed!',
        icon: 'error',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 mb-16">
      <h2 className="text-3xl font-semibold text-center mb-6">📦 Book A Parcel</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Receiver Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Receiver Name</label>
          <input {...register("receiverName", { required: true })} type="text" className="input input-bordered w-full" placeholder="Receiver Name" />
          {errors.receiverName && <span className="text-sm text-red-500">Receiver name is required</span>}
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Pickup Address</label>
          <input {...register("pickupAddress", { required: true })} type="text" className="input input-bordered w-full" placeholder="Pickup Address" />
          {errors.pickupAddress && <span className="text-sm text-red-500">Pickup address is required</span>}
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Delivery Address</label>
          <input {...register("deliveryAddress", { required: true })} type="text" className="input input-bordered w-full" placeholder="Delivery Address" />
          {errors.deliveryAddress && <span className="text-sm text-red-500">Delivery address is required</span>}
        </div>

        {/* Size & Type */}
        <div className="md:flex gap-6">
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">Size</label>
            <input {...register("size", { required: true })} type="text" className="input input-bordered w-full" placeholder="Small / Medium / Large" />
            {errors.size && <span className="text-sm text-red-500">Size is required</span>}
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
            <input {...register("type", { required: true })} type="text" className="input input-bordered w-full" placeholder="Document / Box / Fragile" />
            {errors.type && <span className="text-sm text-red-500">Type is required</span>}
          </div>
        </div>

        {/* Payment Type */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Payment Type</label>
          <select {...register("paymentType", { required: true })} className="input input-bordered w-full">
            <option value="">Select</option>
            <option value="COD">Cash on Delivery</option>
            <option value="PREPAID">Prepaid</option>
          </select>
          {errors.paymentType && <span className="text-sm text-red-500">Payment type is required</span>}
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Book Parcel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAParcel;

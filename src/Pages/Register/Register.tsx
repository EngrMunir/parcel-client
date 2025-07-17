import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hook/useAxiosPublic";

const Register = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.mobile,
        role: "user"
      };

      const response = await axiosPublic.post("/auth/register", registerData);

      if (response.data?.id || response.data?.message === "User registered") {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registration successful!',
          showConfirmButton: false,
          timer: 1500
        });
        reset();
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Something went wrong!'
      });
    }
  };

  return (
    <div className="mx-auto md:w-1/3">
      <h2 className="text-3xl mb-6 text-center">Please Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("name", { required: true })} placeholder="Your Name" className="border w-full mb-4 py-2 px-4" />
        {errors.name && <span className="text-red-500">Name is required</span>}

        <input type="text" {...register("mobile", { required: true })} placeholder="Mobile Number" className="border w-full mb-4 py-2 px-4" />
        {errors.mobile && <span className="text-red-500">Mobile Number is required</span>}

        <input type="email" {...register("email", { required: true })} placeholder="Email" className="border w-full mb-4 py-2 px-4" />
        {errors.email && <span className="text-red-500">Email is required</span>}

        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 6,
            pattern: /(?=.*[A-Z])(?=.*[a-z])/
          })}
          placeholder="Password"
          className="border w-full mb-4 py-2 px-4"
        />
        {errors.password?.type === "required" && <span className="text-red-500">Password is required</span>}
        {errors.password?.type === "minLength" && <span className="text-red-500">Minimum 6 characters required</span>}
        {errors.password?.type === "pattern" && <span className="text-red-500">Must include uppercase & lowercase</span>}

        <input className="btn btn-secondary w-full mb-4" type="submit" value="Register" />
      </form>
      <p className="text-center mb-5">
        Already registered? <Link className="text-blue-500" to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;

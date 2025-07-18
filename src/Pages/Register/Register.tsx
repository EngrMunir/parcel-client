import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRegisterMutation } from "../../redux/features/auth/authApi";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormInputs>();
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const onSubmit = async (data: RegisterFormInputs) => {
  setLoading(true);
  try {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const response = await registerUser(payload).unwrap();

    if (response?.success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: response.message || "Registration successful!",
        showConfirmButton: false,
        timer: 1500,
      });

      reset();
      navigate("/login");
    } 
  } catch (err: any) {
    console.error("Registration error:", err);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Registration failed. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: {
                  value: /(?=.*[a-z])(?=.*[A-Z])/,
                  message: "Must include uppercase & lowercase letters"
                }
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="******"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded-md transition duration-300 
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setCredentials } from "../../redux/features/auth/authSlice";

import { useState } from "react";
import { useAppDispatch } from "../../redux/features/hook";

type TLoginInput = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginInput>();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

 const onSubmit = async (data: { email: string; password: string }) => {
  setLoginError("");

  try {
    const res = await login(data).unwrap();
    const { accessToken, user } = res.data;

    localStorage.setItem("accessToken", accessToken);

    dispatch(setCredentials({ user, token:accessToken }));

    if (user?.role === 'ADMIN') {
      navigate('/dashboard/allParcels');
    } else if (user?.role === 'AGENT') {
      navigate('/dashboard/myDeliveryList');
    } else if (user?.role === 'CUSTOMER') {
      navigate('/dashboard/bookParcel');
    }
  } catch (error: any) {
    setLoginError(error?.data?.message || "Invalid email or password.");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email address"
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-medium rounded-md ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

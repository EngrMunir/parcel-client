import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProviders";
import { useContext, useState } from "react";

const Login = () => {
    const auth = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || "/";

    if (!auth) {
        return <div>Loading...</div>;
    }

    const { login } = auth;


  const onSubmit = async (data: any) => {
    setLoginError("");
    setLoading(true);

    try {
      const { email, password } = data;
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setLoginError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto md:w-1/3">
        <h2 className="text-3xl mb-6 text-center">Please Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
            className="border w-full mb-4 py-2 px-4"
          />
          {errors.email && (
            <span className="text-red-500">Email is required</span>
          )}

          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            className="border w-full mb-4 py-2 px-4"
          />
          {errors.password && (
            <span className="text-red-500">Password is required</span>
          )}

          {loginError && (
            <p className="text-red-600 mb-3 text-center">{loginError}</p>
          )}

          <input
            className="btn btn-secondary w-full mb-4"
            type="submit"
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </form>

        <p className="text-center mb-5">
          New here? Please{" "}
          <Link className="text-blue-500" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

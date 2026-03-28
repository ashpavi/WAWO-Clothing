import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { registerUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
      });

      
      await logoutUser();
      navigate("/login");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        {/* BRAND */}
        <Link
          to="/"
          className="flex items-center justify-center gap-3 mb-6"
        >
          <img
            src={logo}
            alt="LuxeStore"
            className="w-20 h-20 object-contain rounded-full border-b-1 p-1 shadow-sm"
          />

        
        </Link>


        {/* HEADER */}
        <div className="text-center mb-6">

          

          <h2 className="text-2xl font-semibold text-gray-900">
            Create Account
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Join us today
          </p>

        </div>


        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}


        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* NAME */}
          <div>
            <label className="block text-sm mb-2 text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-2 text-gray-600">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* PASSWORD */}
          <div>

            <label className="block text-sm mb-2 text-gray-600">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full bg-gray-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

          </div>


          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>


        {/* LOGIN LINK */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

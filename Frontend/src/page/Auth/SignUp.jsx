import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AuthLayout from '../../components/layouts/AuthLayout'

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password || !form.confirmPassword) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        username: form.username,
        password: form.password,
      });

      const { token, user } = res.data;
      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Account created successfully! Welcome, ${user.username}`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 flex justify-center items-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="flex flex-col items-center mb-6">
            <UserPlus className="text-white w-10 h-10 mb-2" />
            <h2 className="text-3xl font-semibold text-white">Create Account</h2>
            <p className="text-white/70 text-sm mt-1">Join us and start your journey 🚀</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-white/80 text-sm mb-1 block">Username</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <label className="text-white/80 text-sm mb-1 block">Password</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-white/70 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div>
              <label className="text-white/80 text-sm mb-1 block">Confirm Password</label>
              <input
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="mt-3 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </motion.button>
          </form>

          <p className="text-white/80 text-center text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-300 hover:underline hover:text-white">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default Register;

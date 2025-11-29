import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, ArrowRight, Heart } from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import AuthLayout from '../../components/layouts/AuthLayout'
const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('กรุณากรอกข้อมูลให้ครบ')
      return
    }

    setIsLoading(true)
    try {
      // เรียก API login
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        username: form.username,
        password: form.password,
      })

      const { token, user } = res.data

      if (token) {
        localStorage.setItem('accessToken', token)
        localStorage.setItem('user', JSON.stringify(user))
        toast.success(`ยินดีต้อนรับกลับมา, ${user.username}!`)
        navigate('/') // redirect หลัง login สำเร็จ
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side */}
        <div className="text-white space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 mb-6 w-fit mx-auto md:mx-0">
            <Heart className="text-pink-300" size={24} fill="currentColor" />
            <span className="font-bold text-lg">Maow Pao</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl">
            ยินดีต้อนรับ<br />กลับมา! 👋
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-lg">
            เข้าสู่ระบบเพื่อดูแลน้องแมวและค้นหาครอบครัวใหม่ให้พวกเขา 🐱
          </p>
        </div>

        {/* Right side - login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all hover:shadow-pink-200/40"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <h2 className="text-3xl font-black mb-2">เข้าสู่ระบบ</h2>
            <p className="text-white/80">กรอกข้อมูลเพื่อเข้าใช้งาน</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อผู้ใช้</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 font-medium"
                  placeholder="กรอกชื่อผู้ใช้"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 font-medium"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-black text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AuthLayout>
  )
}

export default Login

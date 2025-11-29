import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Heart, User, History, LogOut, Bell, Phone, Mail, Facebook, Instagram, Shield, Award, MapPin } from "lucide-react";
import { useLocation } from 'react-router-dom';

const AuthLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null); // <-- Add user state
    const location = useLocation();

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name[0].toUpperCase();
    };

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        }
    }, [location]);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsOpen(false);
        setIsMobileMenuOpen(false);
        window.location.href = '/'; // redirect ไปหน้า login

    };


    return (
        <div className="flex flex-col min-h-screen">
            {/* Modern Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-xl shadow-xl py-3"
                    : "bg-white/60 backdrop-blur-md shadow-md py-4"
                    }`}
            >
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <img
                                    src="./IconSAKDEE.png"
                                    alt="Logo"
                                    className="w-12 h-12 transition-transform group-hover:scale-110 group-hover:rotate-12"
                                />
                            </div>
                            <span className="font-black text-2xl bg-clip-text text-transparent bg-linear-to-r from-indigo-800 via-blue-600 to-blue-600">
                                Maow Pao
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-2">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `px-5 py-2.5 rounded-full font-semibold transition-all ${isActive
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/adopt"
                                className={({ isActive }) =>
                                    `px-5 py-2.5 rounded-full font-semibold transition-all ${isActive
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                Adopt
                            </NavLink>
                            <NavLink
                                to="https://northsnx.github.io/ExtendX/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-full font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                            >
                                ExtendX
                            </NavLink>

                            {/* User not logged in */}
                            {!user && (
                                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
                                    <NavLink
                                        to="/register"
                                        className="px-6 py-2.5 rounded-full font-semibold text-blue-600 border-2 border-blue-600 hover:text-white hover:bg-blue-600 transition-all"
                                    >
                                        Register
                                    </NavLink>
                                    <NavLink
                                        to="/login"
                                        className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-indigo-800 text-white hover:shadow-lg hover:scale-105 transition-all"
                                    >
                                        Login
                                    </NavLink>
                                </div>
                            )}

                            {/* User logged in */}
                            {user && (
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
                                    {/* Notifications */}
                                    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
                                        <Bell size={20} className="text-gray-600" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>

                                    {/* User Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={toggleDropdown}
                                            className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                                        >
                                            <div className="relative flex items-center gap-2">
                                                <div className="relative w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg border-2 border-blue-600">
                                                    {getInitials(user?.username)}
                                                    {/* Status dot */}
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                </div>
                                                <span className="font-semibold text-gray-700">{user?.username}</span>
                                            </div>


                                            <ChevronDown
                                                size={18}
                                                className={`transition-transform ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                                                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
                                                    <p className="font-bold text-lg">สวัสดี, {user.username}! 👋</p>
                                                    <p className="text-sm text-white/80">ยินดีต้อนรับกลับมา</p>
                                                </div>

                                                <div className="p-2">
                                                    {/* ลิงก์ไปหน้าโปรไฟล์ */}
                                                    <Link
                                                        to="/user"
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                                                    >
                                                        <User size={20} className="text-blue-600" />
                                                        <span className="font-semibold text-gray-700">
                                                            โปรไฟล์
                                                        </span>
                                                    </Link>

                                                    {/* ลิงก์ไปหน้าที่ถูกใจ */}
                                                    <Link
                                                        to="/user"
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                                                    >
                                                        <Heart size={20} className="text-blue-600" />
                                                        <span className="font-semibold text-gray-700">
                                                            รายการโปรด
                                                        </span>
                                                    </Link>

                                                    {/* ลิงก์ไปประวัติการใช้งาน */}
                                                    <Link
                                                        to="/user"
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                                                    >
                                                        <History size={20} className="text-blue-600" />
                                                        <span className="font-semibold text-gray-700">
                                                            ประวัติการใช้งาน
                                                        </span>
                                                    </Link>

                                                    <div className="h-px bg-gray-200 my-2"></div>

                                                    {/* ปุ่มออกจากระบบ */}
                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setIsOpen(false);
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all group w-full"
                                                    >
                                                        <LogOut
                                                            size={20}
                                                            className="text-red-600 group-hover:scale-110 transition-transform"
                                                        />
                                                        <span className="font-semibold text-red-600">
                                                            ออกจากระบบ
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            {isMobileMenuOpen ? (
                                <X size={28} className="text-gray-700" />
                            ) : (
                                <Menu size={28} className="text-gray-700" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
                            <div className="flex flex-col gap-2 mt-4">
                                <NavLink
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg font-semibold transition-all ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    to="/adopt"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg font-semibold transition-all ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    Adopt
                                </NavLink>
                                <NavLink
                                    to="https://northsnx.github.io/ExtendX/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                                >
                                    ExtendX
                                </NavLink>

                                {!user && (
                                    <>
                                        <NavLink
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-4 py-3 rounded-lg font-semibold text-blue-600 text-center border-2 border-blue-600 hover:bg-purple-600 hover:text-white transition-all mt-4"
                                        >
                                            Register
                                        </NavLink>
                                        <NavLink
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-4 py-3 rounded-lg font-semibold text-center bg-blue-600 text-white"
                                        >
                                            Login
                                        </NavLink>
                                    </>
                                )}

                                {user && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="px-4 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg mb-2">
                                            <p className="font-bold text-blue-800">
                                                สวัสดี, {user.username}! 👋
                                            </p>
                                        </div>
                                        <Link
                                            to="/user"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            <User size={20} className="text-blue-600" />
                                            <span className="font-semibold text-gray-700">
                                                โปรไฟล์
                                            </span>
                                        </Link>
                                        <Link
                                            to="/user"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            <Heart size={20} className="text-blue-600" />
                                            <span className="font-semibold text-gray-700">
                                                โปรไฟล์
                                            </span>
                                        </Link>
                                        <Link
                                            to="/user"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                            <History size={20} className="text-blue-600" />
                                            <span className="font-semibold text-gray-700">
                                                ประวัติการใช้งาน
                                            </span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all w-full"
                                        >
                                            <LogOut size={20} className="text-red-600" />
                                            <span className="font-semibold text-red-600">
                                                ออกจากระบบ
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="h-20"></div>

            {children}

            {/* <FloatingAd /> */}

            {/* Enhanced Footer */}
            <footer className="bg-gray-800 text-white py-16 relative overflow-hidden">
      
              <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                  {/* Brand */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src="./IconSAKDEE.png" alt="Logo" className="w-12 h-12" />
                      <h3 className="text-3xl font-black bg-clip-text text-white">
                        Maow Pao
                      </h3>
                    </div>
                    <p className="text-white/80 leading-relaxed mb-4">
                      แพลตฟอร์มเพื่อการช่วยเหลือและอุปการะสัตว์จรจัด
                      ด้วยหัวใจและเทคโนโลยี
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all transform hover:scale-110"
                      >
                        <Facebook size={18} />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-500 transition-all transform hover:scale-110"
                      >
                        <Instagram size={18} />
                      </a>
                    </div>
                  </div>
      
                  {/* Quick Links */}
                  <div>
                    <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
                      เมนูหลัก
                    </h4>
                    <ul className="space-y-3 text-white/80">
                      <li>
                        <a
                          href="/adopt"
                          className="hover:text-pink-400 transition flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform"></span>
                          รับเลี้ยงแมว
                        </a>
                      </li>
                      <li>
                        <a
                          href="/adopt"
                          className="hover:text-pink-400 transition flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform"></span>
                          ช่วยเหลือสัตว์
                        </a>
                      </li>
                      <li>
                        <a
                          href="/adopt"
                          className="hover:text-pink-400 transition flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform"></span>
                          บริจาค
                        </a>
                      </li>
                      <li>
                        <a
                          href="/adopt"
                          className="hover:text-pink-400 transition flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full group-hover:scale-150 transition-transform"></span>
                          เกี่ยวกับเรา
                        </a>
                      </li>
                    </ul>
                  </div>
      
                  {/* Contact */}
                  <div>
                    <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
                      ติดต่อเรา
                    </h4>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start gap-3 hover:text-pink-400 transition">
                        <Phone size={18} className="mt-0.5 flex-shrink-0" />
                        <span>02-XXX-XXXX</span>
                      </li>
                      <li className="flex items-start gap-3 hover:text-pink-400 transition">
                        <Mail size={18} className="mt-0.5 flex-shrink-0" />
                        <span>info@maowpao.com</span>
                      </li>
                      <li className="flex items-start gap-3 hover:text-pink-400 transition">
                        <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                        <span>กรุงเทพมหานคร ประเทศไทย</span>
                      </li>
                    </ul>
                  </div>
      
                  {/* Newsletter */}
                  <div>
                    <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
                      รับข่าวสาร
                    </h4>
                    <p className="text-white/80 text-sm mb-4">
                      รับข้อมูลแมวตัวใหม่และข่าวสารต่างๆ
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="อีเมลของคุณ"
                        className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <button className="px-6 py-2 bg-gray-900 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">
                        ✓
                      </button>
                    </div>
                  </div>
                </div>
      
                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    © 2025 Maow Pao by ExtendX. All rights reserved.
                  </p>
                  <div className="flex gap-6 text-sm text-gray-400">
                    <p className="hover:text-pink-400 transition flex items-center gap-1" >
                      <Shield size={14} />
                      นโยบายความเป็นส่วนตัว
                    </p>
                    <p className="hover:text-pink-400 transition flex items-center gap-1">                 
                      <Award size={14} />
                      ข้อกำหนดการใช้งาน
                    </p>
                  </div>
                </div>
              </div>
            </footer>
        </div>
    )
}

export default AuthLayout




// ! Make for public navbar
import React, { useEffect, useState } from "react";
import { Heart, Search, MapPin, Clock, Phone, Mail, Facebook, Instagram, Shield, Award, Users } from "lucide-react";
import AuthLayout from "../components/layouts/AuthLayout";
import { API_BASE_URL, API_PATHS } from "../utils/apiPaths";
import axios from "axios";

const MainPage = () => {
  const [cats, setCats] = useState([]);
  const [stats, setStats] = useState({ adopted: 247, rescued: 156, active: 89 });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}${API_PATHS.CATMODEL.GET_ALL}`);
        setCats(response.data);
      } catch (error) {
        console.error("Failed to fetch cats:", error);
      }
    };

    fetchCats();
  }, []);

  return (
    <AuthLayout>
      <div className="font-sans text-gray-800 overflow-x-hidden">

        {/* Hero Section - Enhanced */}
        <section
          className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('./coverpage.png')" }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/50 to-black/70"></div>
          <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
            <h1 className="text-8xl md:text-8xl font-black mb-6 drop-shadow-2xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-blue-400 to-blue-400 animate-fadeIn">
              Maow Pao
            </h1>
            <p className="text-2xl md:text-4xl mb-4 font-bold text-white drop-shadow-lg">
              by ExtendX
            </p>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-100 drop-shadow-lg leading-relaxed">
              รวมทุกน้องแมวจรที่รอครอบครัวใหม่ พร้อมให้คุณแบ่งปันความรักได้ทุกวัน
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#Features"
                className="inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-full bg-linear-to-r from-blue-700 via-indigo-500 to-blue-700 text-white shadow-2xl hover:scale-110  transition-all duration-300 transform "
              >
                🚀 เริ่มต้นเลย
              </a>
              <a
                href="#Stats"
                className="inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-full bg-white/10 backdrop-blur-lg text-white border-2 border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                📊 ดูสถิติ
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Stats Section - NEW */}
        <section id="Stats" className="py-16 bg-linear-to-r from-purple-600 to-indigo-600 -mt-20 relative z-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Heart className="w-8 h-8" />, number: stats.adopted, label: "แมวที่ได้บ้านแล้ว", color: "text-white" },
                { icon: <Shield className="w-8 h-8" />, number: stats.rescued, label: "แมวที่ช่วยเหลือแล้ว", color: "text-white" },
                { icon: <Users className="w-8 h-8" />, number: stats.active, label: "แมวที่รอคุณอยู่", color: "text-white" }
              ].map((stat, i) => (
                <div key={i} className="text-center text-white">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/40 mb-4 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-black mb-2">{stat.number}+</div>
                  <div className="text-lg text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced */}
        <section id="Features" className="py-24 bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-10 left-20 text-9xl">🐾</div>
            <div className="absolute bottom-20 right-20 text-9xl">💕</div>
          </div>

          <div className="container mx-auto text-center px-6 relative z-10">
            <div className="inline-block mb-4 px-6 py-2 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg">
              ✨ FEATURED
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-pink-600 to-blue-600">
              สิ่งที่เรามีให้คุณ
            </h2>
            <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
              เว็บของเราถูกสร้างขึ้นเพื่อเป็นพื้นที่กลางในการช่วยเหลือสัตว์จรจัด 🐾<br />
              ไม่ว่าคุณจะอยากรับเลี้ยง ช่วยเหลือ หรือร่วมสนับสนุน — <span className="font-bold text-purple-600">ที่นี่มีทุกอย่างสำหรับคุณ</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                {
                  icon: "🐱",
                  title: "Adopt",
                  desc: "ค้นหาสัตว์เลี้ยงที่รอคอยบ้านใหม่ พร้อมข้อมูลการดูแลแบบครบถ้วน มีระบบจับคู่ที่เหมาะสมกับคุณ",
                  link: "/adopt",
                  linear: "from-blue-400 via-blue-500 to-blue-600",
                  features: ["🔍 ค้นหาง่าย", "📋 ข้อมูลครบถ้วน", "💬 ติดต่อสะดวก"]
                },
                {
                  icon: "🚑",
                  title: "Rescue",
                  desc: "แจ้งเหตุและเข้าร่วมช่วยเหลือสัตว์ที่ต้องการความช่วยเหลืออย่างเร่งด่วน พร้อมระบบแจ้งเตือนแบบ Real-time",
                  link: "/adopt",
                  linear: "from-purple-400 via-purple-500 to-purple-600",
                  features: ["📍 แจ้งพิกัด", "⚡ ตอบสนองเร็ว", "🤝 ร่วมช่วย"]
                },
                {
                  icon: "💖",
                  title: "Donate",
                  desc: "สนับสนุนค่าอาหาร ยารักษา และค่าใช้จ่ายในการดูแลสัตว์ ระบบโปร่งใส ตรวจสอบได้",
                  link: "/adopt",
                  linear: "from-pink-400 via-pink-500 to-red-500",
                  features: ["💳 จ่ายง่าย", "📊 โปร่งใส", "🎁 รางวัล"]
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${item.linear} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <div className="relative p-8 z-10">
                    <div className="text-7xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                      {item.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-4 text-gray-800 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-white/90 transition-colors">
                      {item.desc}
                    </p>

                    <div className="space-y-2 mb-6">
                      {item.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-500 group-hover:text-white/80 transition-colors">
                          <span className="mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <a
                      href={item.link}
                      className="inline-flex items-center justify-center w-full px-6 py-4 bg-gray-900 text-white rounded-full font-bold group-hover:bg-white group-hover:text-gray-900 transition-all transform group-hover:scale-105 shadow-lg"
                    >
                      {item.title === "Donate" ? "ร่วมสมทบทุน" : item.title === "Rescue" ? "ดูวิธีการช่วยเหลือ" : "เริ่มต้นการอุปการะ"} →
                    </a>
                  </div>

                  {/* Decorative corner */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br ${item.linear} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - NEW */}
        <section className="py-24 bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-black mb-20">🎉ใช้งานง่ายเพียง 3 ขั้นตอน</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                { step: "01", icon: "🔍", title: "ค้นหา", desc: "เลือกแมวที่ใช่สำหรับคุณ" },
                { step: "02", icon: "📝", title: "สมัคร", desc: "กรอกข้อมูลและยื่นคำขอ" },
                { step: "03", icon: "🏠", title: "รับเลี้ยง", desc: "พบกับสมาชิกใหม่ของครอบครัว" }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-6xl font-black text-white/80 mb-4">{item.step}</div>
                    <div className="text-6xl mb-4">{item.icon}</div>
                    <h3 className="text-3xl font-bold mb-3">{item.title}</h3>
                    <p className="text-xl text-white/80">{item.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-11 transform -translate-y-1/2 text-5xl text-white/50">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Adoption Highlight - Enhanced */}
        <section className="py-24 bg-linear-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg">
                🔥 POPULAR
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-blue-600">
                😺 แมวเป้าที่รอคุณอยู่ 😺
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                พบกับน้องแมวน่ารักที่กำลังมองหาบ้านอบอุ่น
              </p>
            </div>

            <div className="flex justify-between items-center mb-8 px-6">
              <div className="flex gap-3">
                {["ทั้งหมด", "น้องใหม่", "ยอดนิยม"].map((filter, i) => (
                  <button key={i} className={`px-6 py-2 rounded-full font-semibold transition-all ${i === 0 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                    {filter}
                  </button>
                ))}
              </div>
              <a href="/adopt" className="text-purple-600 hover:text-purple-700 font-bold transition flex items-center gap-2 group">
                ดูทั้งหมด
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-6">
              {cats.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block animate-spin text-6xl mb-4">🐱</div>
                  <p className="text-gray-500 text-xl">กำลังโหลดข้อมูลแมว...</p>
                </div>
              ) : (
                // cats.slice(0, 5).map((cat, index) => (
                cats.slice(-5).reverse().map((cat, index) => (
                  <div
                    key={cat.cat_id}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <figure className="relative overflow-hidden">
                      <img
                        src={
                          Array.isArray(cat.images) && cat.images.length > 0
                            ? cat.images[0]
                            : "https://placehold.co/300x300?text=No+Image"
                        }
                        alt={cat.name}
                        className="h-64 w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-linear-to-r from-pink-500 to-red-500 text-xs text-white px-3 py-1 rounded-full shadow-lg font-bold animate-pulse">
                          NEW
                        </span>
                      </div>

                      <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-500 hover:text-white transform hover:scale-110">
                        <Heart size={18} />
                      </button>
                    </figure>

                    <div className="p-6">
                      <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <span className={cat.gender === "เพศผู้" ? "text-blue-500" : "text-pink-500"}>
                            {cat.gender === "เพศผู้" ? "♂" : "♀"}
                          </span>
                          {cat.gender}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {cat.age} ปี
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {cat.description}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          Post by: {cat?.createdBy?.username ?? "Unknown"}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={12} />
                          {cat.created_at ? new Date(cat.created_at).toLocaleDateString("th-TH") : ""}
                        </span>
                        <button className="text-purple-600 font-bold text-sm hover:text-purple-700 transition">
                          ดูรายละเอียด →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonials - NEW */}
        <section className="py-24 bg-linear-to-br from-gray-100 via-blue-50 to-purple-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black mb-4 text-gray-800">💬 เสียงจากผู้ใช้งาน</h2>
              <p className="text-xl text-gray-600">ประสบการณ์จริงจากผู้ที่ได้รับเลี้ยงน้องแมว</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: "คุณนุชจรี", text: "ฉันเป็นพนักงงาน O2O ของสยามรถดั้ม ฉันต้องขอบคุณ Maow Pao ที่ช่วยให้ฉันได้พบกับน้องแนทที่น่ารัก ตอนนี้ชีวิตฉันมีความสุขมากขึ้น", rating: 5, avatar: "👩" },
                { name: "คุณนิรัญ", text: "ระบบใช้งานง่าย ข้อมูลครบถ้วน ทีมงานใจดีมากครับ แนะนำเลยครับ", rating: 5, avatar: "👨" },
                { name: "คุณธิดาพร", text: "ได้น้องแมว 2 ตัวเลย น่ารักทั้งคู่ เลี้ยงง่าย ขอบคุณมากคะ", rating: 5, avatar: "👦" }
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{review.name}</h4>
                      <div className="flex text-yellow-400">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call To Action - Enhanced */}
        <section className="py-32 bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-800 text-center text-white relative overflow-hidden">

          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-black mb-8 drop-shadow-2xl leading-tight">
              พร้อมจะเป็นบ้านใหม่<br />ให้พวกเขาไหม? 🏠
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
              น้องแมวกว่า <span className="font-black text-yellow-300">89 ตัว</span> กำลังรอคุณอยู่
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="/adopt"
                className="inline-flex items-center justify-center gap-3 px-12 py-6 text-xl font-black rounded-full bg-white text-purple-700 hover:bg-blue-600 hover:text-white shadow-2xl hover:scale-110  transition-all duration-300 transform "
              >
                💕 เริ่มอุปการะเลย
              </a>
              <a
                href="/rescue"
                className="inline-flex items-center justify-center gap-3 px-12 py-6 text-xl font-black rounded-full bg-white/10 backdrop-blur-lg text-white border-2 border-white/30 hover:bg-white/20 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                ช่วยเหลือแมว
              </a>
            </div>
          </div>
        </section>

      </div>
    </AuthLayout>
  );
};

export default MainPage;

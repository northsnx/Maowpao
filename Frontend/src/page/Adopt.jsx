import React, { useEffect, useState } from "react";
import { Heart, Search, Filter, Clock, Info, X, MapPin } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, API_PATHS } from "../utils/apiPaths";
import AuthLayout from "../components/layouts/AuthLayout";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Adopt = () => {
  const [cats, setCats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterAge, setFilterAge] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [adoptionStatus, setAdoptionStatus] = useState({});
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [isFiltered, setIsFiltered] = useState(false);

  const clearFilters = () => {
    setFilterGender("all");
    setFilterAge("all");
    setIsFiltered(false);
  };


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, [location]);

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

  const filteredCats = cats.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filterGender === "all" || cat.gender === filterGender;
    const matchesAge =
      filterAge === "all" ||
      (filterAge === "young" && cat.age <= 2) ||
      (filterAge === "adult" && cat.age > 2 && cat.age <= 7) ||
      (filterAge === "senior" && cat.age > 7);
    return matchesSearch && matchesGender && matchesAge;
  });

  const toggleFavorite = (catId) => {
    setFavorites((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const requestAdoption = async (catId, message = "") => {
    // ถ้า request อยู่แล้ว (pending/approved/rejected) ห้ามส่งซ้ำ
    if (adoptionStatus[catId] && adoptionStatus[catId] !== "available") return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}${API_PATHS.ADOPTION.CREATE_REQUEST}`,
        { catId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "ส่งคำขออุปการะเรียบร้อย!");

      // เปลี่ยนสถานะของปุ่มเป็น pending
      setAdoptionStatus(prev => ({ ...prev, [catId]: "pending" }));

    } catch (error) {
      console.error("Failed to request adoption:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถส่งคำขออุปการะได้");
    }
  };


  useEffect(() => {
    if (!user) return;

    const fetchAdoptions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${API_BASE_URL}${API_PATHS.ADOPTION.GET_MY_ADOPTION_REQUESTS}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const statusMap = {};
        response.data.forEach(item => {
          statusMap[item.cat._id] = item.status; // pending / approved / rejected
        });

        setAdoptionStatus(statusMap);

      } catch (error) {
        console.error("Failed to fetch adoption requests:", error);
      }
    };

    fetchAdoptions();
  }, [user]);



  return (
    <AuthLayout>


      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">

        <section
          className="relative py-24 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('./coverpage.png')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-xl">
              ค้นหาเพื่อนขนปุย
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8">
              พบกับน้องแมวน่ารักที่กำลังมองหาบ้านอบอุ่น 💕
            </p>

            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={22} />
                <input
                  type="text"
                  placeholder="ค้นหาตามชื่อ, สี, หรือคุณสมบัติ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-full text-lg shadow-xl bg-gray-200/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                />
              </div>
            </div>
          </div>
        </section>


        {/* Filter Section */}
        <section className="sticky top-20 z-40 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (showFilters) {
                      // ถ้าตัวกรองเปิดอยู่ → ล้าง + ปิด
                      clearFilters();
                      setShowFilters(false);
                    } else {
                      // ถ้าตัวกรองปิด → เปิดกรอง
                      setShowFilters(true);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all
                    ${showFilters
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                >
                  <Filter size={18} />
                  {showFilters ? "ล้างตัวกรอง" : "ตัวกรอง"}
                </button>



                {showFilters && (
                  <div className="flex flex-wrap gap-2 p-3 border-2 border-purple-400 rounded-2xl bg-purple-50">

                    <select
                      value={filterGender}
                      onChange={(e) => {
                        setFilterGender(e.target.value);
                        setIsFiltered(true);
                      }}
                      className="px-4 py-2 rounded-full border-2 border-purple-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">เพศทั้งหมด</option>
                      <option value="ผู้">เพศผู้</option>
                      <option value="เมีย">เพศเมีย</option>
                    </select>

                    <select
                      value={filterAge}
                      onChange={(e) => {
                        setFilterAge(e.target.value);
                        setIsFiltered(true);
                      }}
                      className="px-4 py-2 rounded-full border-2 border-purple-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">อายุทั้งหมด</option>
                      <option value="young">น้อง (0-2 ปี)</option>
                      <option value="adult">วัยรุ่น (3-7 ปี)</option>
                      <option value="senior">ผู้ใหญ่ (8+ ปี)</option>
                    </select>

                  </div>
                )}
              </div>

              <div className="text-gray-600 font-semibold">
                แสดง <span className="text-purple-600 font-bold">{filteredCats.length}</span> จาก {cats.length} ตัว
              </div>
            </div>
          </div>
        </section>

        {/* Cats Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            {filteredCats.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">😿</div>
                <p className="text-2xl text-gray-500 mb-4">ไม่พบแมวที่ตรงกับการค้นหา</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterGender("all");
                    setFilterAge("all");
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCats.slice().reverse().map((cat) => (
                  <div
                    key={cat.cat_id}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <figure className="relative overflow-hidden h-64">
                      <img
                        src={
                          Array.isArray(cat.images) && cat.images.length > 0
                            ? cat.images[0]
                            : "https://placehold.co/400x400?text=No+Image"
                        }
                        alt={cat.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {cat.status === "available" && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          พร้อมรับเลี้ยง
                        </span>
                      )}

                      <button
                        onClick={() => toggleFavorite(cat.cat_id)}
                        className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${favorites.includes(cat.cat_id)
                          ? "bg-pink-500 text-white scale-110"
                          : "bg-white/90 text-gray-600 hover:bg-pink-500 hover:text-white"
                          }`}
                      >
                        <Heart size={18} fill={favorites.includes(cat.cat_id) ? "currentColor" : "none"} />
                      </button>

                      <button
                        onClick={() => setSelectedCat(cat)}
                        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-2 py-2 bg-white/90 backdrop-blur-sm rounded-full font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-105"
                      >
                        <Info size={16} className="inline mr-2" />
                        ดูรายละเอียด
                      </button>
                    </figure>

                    <div className="p-5">
                      <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {cat.name}
                      </h3>

                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className={`flex items-center gap-1 ${cat.gender === "ผู้" ? "text-blue-600" : "text-pink-600"}`}>
                          {cat.gender === "ผู้" ? "♂" : "♀"} {cat.gender}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {cat.age} ปี
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-2">
                          <MapPin size={14} className="text-purple-600" />
                          {cat?.location ?? "ไม่พบข้อมูล"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {cat.description}
                      </p>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        Post by: {cat.createdBy?.username || 'Unknown'}
                      </p>

                      <button
                        onClick={() => requestAdoption(cat._id)}
                        disabled={adoptionStatus[cat._id] && adoptionStatus[cat._id] !== "available"}
                        className={`w-full py-3 rounded-full font-bold transition-all 
                          ${adoptionStatus[cat._id] === "available" || !adoptionStatus[cat._id]
                            ? "bg-green-600 text-white hover:shadow-lg hover:scale-105"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                          }`}
                      >
                        {(() => {
                          const status = adoptionStatus[cat._id];
                          if (status === "pending") return "รออนุมัติ";
                          if (status === "approved") return "อุปการะสำเร็จ";
                          if (status === "rejected") return "ถูกปฏิเสธ";
                          return "อุปการะเลย";
                        })()}
                      </button>



                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Detail Modal */}
        {selectedCat && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
              <div className="relative">
                <img
                  src={
                    Array.isArray(selectedCat.images) && selectedCat.images.length > 0
                      ? selectedCat.images[0]
                      : "https://placehold.co/800x600?text=No+Image"
                  }
                  alt={selectedCat.name}
                  className="w-full h-128 object-cover"
                />
                <button
                  onClick={() => setSelectedCat(null)}
                  className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-4xl font-black text-gray-800 mb-2">{selectedCat.name}</h2>
                    <div className="flex items-center gap-4 text-gray-600 text-2xl">
                      <span className={`flex items-center gap-2 ${selectedCat.gender === "ผู้" ? "text-blue-600" : "text-pink-600"} font-semibold`}>
                        {selectedCat.gender === "ผู้" ? "♂" : "♀"} {selectedCat.gender}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-2">
                        <Clock size={18} />
                        อายุ {selectedCat.age} ปี
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-2">
                        <MapPin size={18} className="text-purple-600" />
                        {selectedCat.location ?? "ไม่พบข้อมูล"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedCat.cat_id)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${favorites.includes(selectedCat.cat_id)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-pink-500 hover:text-white"
                      }`}
                  >
                    <Heart size={24} fill={favorites.includes(selectedCat.cat_id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">📝 เกี่ยวกับ {selectedCat.name}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{selectedCat.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">📋 ข้อมูลเพิ่มเติม</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-xl">
                        <p className="text-lg text-gray-600 mb-1">สถานะ</p>
                        <p className="font-bold text-green-600 text-xl">{selectedCat.status}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <p className="text-lg text-gray-600 mb-1">วันที่เพิ่ม</p>
                        <p className="font-bold text-green-600 text-xl">
                          {selectedCat.createdAt
                            ? new Date(selectedCat.createdAt).toLocaleDateString("th-TH")
                            : "ไม่ระบุ"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={() => requestAdoption(selectedCat._id)}
                      disabled={adoptionStatus[selectedCat._id] && adoptionStatus[selectedCat._id] !== "available"}
                      className={`w-full py-4 rounded-full text-lg font-black transition-all
                        ${adoptionStatus[selectedCat._id] === "available" || !adoptionStatus[selectedCat._id]
                          ? "bg-gradient-to-r from-green-800 to-green-600 text-white hover:shadow-xl hover:scale-105"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                    >
                      {(() => {
                        const status = adoptionStatus[selectedCat._id];
                        if (status === "pending") return "รออนุมัติ";
                        if (status === "approved") return "อุปการะสำเร็จ";
                        if (status === "rejected") return "ถูกปฏิเสธ";
                        return "ยื่นคำขอรับเลี้ยง";
                      })()}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      เราจะติดต่อกลับภายใน 24 ชั่วโมง
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Adopt;

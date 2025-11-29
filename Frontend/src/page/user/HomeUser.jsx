import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Edit, Trash2, X, Upload, MapPin, Clock, Heart, Share2, Eye, Settings } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import axios from "axios";
import { API_BASE_URL, API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import Uploadfile from "./Uploadfile";


const UserProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]); // <-- pulled posts from CATMODEL.MY_CATS: '/api/v1/cats/user/mycats'
  const [editingCatId, setEditingCatId] = useState(null);

  const [adoptionHistory, setAdoptionHistory] = useState([]);


  const [user, setUser] = useState(null);
  const location = useLocation();

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
    if (!user) return;

    const fetchMyCats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${API_BASE_URL}${API_PATHS.CATMODEL.MY_CATS}`,
          {
            headers: {
              Authorization: `Bearer ${token}` // ส่ง token ไปด้วย
            }
          }
        );

        const mapped = response.data.map(cat => ({
          id: cat._id,
          name: cat.name,
          img: cat.images?.[0] || "https://placehold.co/400x400?text=No+Image",
          location: "ไม่ระบุ",
          datetime: cat.createdAt,
          gender: cat.gender === "Female" ? "เมีย" : "ผู้",
          age: cat.age,
          details: cat.description,
          views: 0,
          favorites: 0
        }));

        setPosts(mapped);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchMyCats();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchAdoptionHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${API_BASE_URL}${API_PATHS.ADOPTION.GET_MY_ADOPTION_REQUESTS}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mappedHistory = response.data.map(item => ({
          id: item._id || item.cat?._id, // fallback เผื่อ _id ของ adoption ไม่มี
          catName: item.cat?.name || "Unknown Cat",
          owner: item.cat?.createdBy?.username || item.owner?.username || "Unknown",
          adopter: item.adopter?.username || "Unknown",
          status: item.status,
          message: item.message,
          datetime: item.createdAt, // ใช้ createdAt ของ document adoption
        }));

        setAdoptionHistory(mappedHistory);

      } catch (err) {
        console.error("Failed to fetch adoption history:", err);
      }
    };

    fetchAdoptionHistory();
  }, [user]);


  const handleAddCat = async () => {
    const genderMap = { "ผู้": "Male", "เมีย": "Female", "ไม่ทราบ": "Male" };

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${API_BASE_URL}${API_PATHS.CATMODEL.GET_ALL}`,
        {
          name: formData.name,
          age: Number(formData.age),
          gender: genderMap[formData.gender],
          description: formData.details,
          status: "available",
          images: formData.image, // ต้องเป็น array ของ URL จาก Cloudinary

        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("สร้างแมวสำเร็จ!");
      setFormData({ name: "", age: "", gender: "ไม่ทราบ", details: "", image: [] });
    } catch (err) {
      console.error(err);
      toast.error("สร้างแมวไม่สำเร็จ");
    }
  };



  const [formData, setFormData] = useState({
    name: "",
    age: "",           // เพิ่ม field สำหรับอายุ
    location: "",
    datetime: "",
    gender: "ไม่ทราบ",
    details: "",
    image: [],
  });


  const [userStats] = useState({
    posts: 9,
    adopted: 9,
    favorites: 99,
  });


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateCat = async (catId, updatedData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `${API_BASE_URL}${API_PATHS.CATMODEL.UPDATE(catId)}`, // ใช้ path ใหม่
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // อัปเดต state ของ posts
      setPosts((prev) =>
        prev.map((post) => (post.id === catId ? { ...post, ...response.data } : post))
      );
      toast.success('อัปเดตข้อมูลแมวสำเร็จ!');
    } catch (error) {
      console.error('Failed to update cat:', error);
      toast.error(error.response?.data?.message || 'ไม่สามารถอัปเดตแมวได้');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && editingCatId) {
      // ส่ง formData เป็น updatedData
      handleUpdateCat(editingCatId, {
        name: formData.name,
        gender: formData.gender,
        age: Number(formData.age),
        description: formData.details,
        location: formData.location,
        datetime: formData.datetime,
        images: formData.image, // image: ถ้ามีการ handle image upload ให้ใส่ตรงนี้
      });
    } else {
      handleAddCat();
    }
    // ปิด modal และ reset formData
    setShowModal(false);
    setFormData({
      name: "",
      location: "",
      datetime: "",
      gender: "ไม่ทราบ",
      details: "",
      age: "",
      images: [],
    });
    setEditMode(false);
    setEditingCatId(null);
  };

  const handleDeleteCat = async (catId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแมวตัวนี้?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_BASE_URL}/api/v1/cats/${catId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // อัปเดต state ของ posts หลังจากลบ
      setPosts((prev) => prev.filter((post) => post.id !== catId));
      toast.success("ลบแมวสำเร็จ!");
    } catch (error) {
      console.error("Failed to delete cat:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถลบแมวได้");
    }
  };


  const getInitials = (name) => {
    if (!name) return 'U';
    return name[0].toUpperCase();
  };

  const cancelAdoptionRequest = async (adoptionId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำขออุปการะ?")) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${API_BASE_URL}${API_PATHS.ADOPTION.CANCEL_ADOPTION(adoptionId)}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAdoptionHistory(prev => prev.filter(item => item._id !== adoptionId));

      toast.success("ยกเลิกคำขออุปการะเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Failed to cancel adoption:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถยกเลิกคำขออุปการะได้");
    }
  };

  const rejectRequest = async (adoptionId) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `${API_BASE_URL}${API_PATHS.ADOPTION.REJECT_ADOPTION(adoptionId)}`,
        {}, // body ว่าง
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ลบออกจาก state หลังปฏิเสธ
      setAdoptionHistory(prev =>
        prev.filter(item => item.id !== adoptionId)
      );

      toast.success("ปฏิเสธคำขออุปการะเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Failed to reject adoption:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถปฏิเสธคำขออุปการะได้");
    }
  };

  const approveRequest = async (adoptionId) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `${API_BASE_URL}${API_PATHS.ADOPTION.APPROVE_ADOPTION(adoptionId)}`,
        {}, // body ว่าง
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // อัปเดต state หลังอนุมัติ
      setAdoptionHistory(prev =>
        prev.filter(item => item.id !== adoptionId)
      );

      toast.success("อนุมัติคำขออุปการะเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("Failed to approve adoption:", error);
      toast.error(error.response?.data?.message || "ไม่สามารถอนุมัติคำขออุปการะได้");
    }
  };


  const [ownerRequests, setOwnerRequests] = useState([]);

  const fetchOwnerRequests = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}${API_PATHS.ADOPTION.GET_REQUESTS_FOR_OWNER}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // map ข้อมูลให้ง่ายต่อ UI
      const mapped = response.data.map(item => ({
        id: item._id,
        catName: item.cat?.name || "Unknown Cat",   // ใช้ optional chaining + fallback
        adopter: item.adopter?.username || "Unknown",
        status: item.status,
        message: item.message,
        datetime: item.createdAt
      }));

      setOwnerRequests(mapped);
    } catch (err) {
      console.error("Failed to fetch owner requests:", err);
    }
  };

  useEffect(() => {
    fetchOwnerRequests();
  }, []);



  return (
    <AuthLayout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">
        {/* Hero Profile Header */}



        <section className="relative text-white flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('./coverpage.png')" }}>
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="container mx-auto px-6 py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative w-40 h-40 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-6xl border-blue-600 border-4 shadow-2xl">
                  {getInitials(user?.username)}
                  {/* Online Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  {/* Edit Button */}
                  <button className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Edit size={18} className="text-purple-600" />
                  </button>
                </div>
              </div>


              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <h1 className="text-4xl font-black">{user?.username}</h1>
                  <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                    <Settings size={18} />
                  </button>
                </div>
                <p className="text-xl text-white/90 mb-2">{user?.username}@maowpao.net</p>
                <p className="text-lg text-white/80 max-w-2xl mb-6">
                  รักน้องแมวทุกตัว และอยากหาบ้านที่อบอุ่นให้พวกเขา 🐱💕
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-black">{userStats.posts}</div>
                    <div className="text-sm text-white/80">โพสต์</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black">{userStats.adopted}</div>
                    <div className="text-sm text-white/80">ได้บ้านแล้ว</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black">{userStats.favorites}</div>
                    <div className="text-sm text-white/80">ถูกใจ</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-purple-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Plus size={20} />
                    เพิ่มน้องแมว
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full font-bold hover:bg-white/30 transition-all">
                    <Share2 size={20} />
                    แชร์โปรไฟล์
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="sticky top-20 z-40 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-6">
            <div className="flex gap-8">
              {["posts", "favorites", "history", "request"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-bold transition-all border-b-4 ${activeTab === tab
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab === "posts" && "โพสต์ของฉัน"}
                  {tab === "favorites" && "รายการโปรด"}
                  {tab === "history" && "ประวัติการรับเลี้ยง"}
                  {tab === "request" && "คำขออุปการะ"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="container mx-auto px-6 py-12">
          {activeTab === "posts" && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-800">
                  โพสต์ของฉัน ({posts.length})
                </h2>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold hover:bg-purple-200 transition-all">
                    ทั้งหมด
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all">
                    ได้บ้านแล้ว
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all">
                    รอเจ้าของ
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <figure className="relative overflow-hidden h-64">
                      <img
                        src={post.img}
                        alt={post.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Stats on Hover */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3 text-white text-sm">
                          <span className="flex items-center gap-1">
                            <Eye size={16} />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={16} fill="white" />
                            {post.favorites}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                          onClick={() => {
                            setEditMode(true);           // เปิดโหมดแก้ไข
                            setEditingCatId(post.id);    // เก็บ id ของแมวที่จะแก้ไข
                            setFormData({                // เติมข้อมูลลงใน form
                              name: post.name,
                              location: post.location,
                              datetime: post.datetime,
                              gender: post.gender,
                              details: post.details,
                              age: post.age,
                              image: post.images || [],
                              // ถ้าอยากอัปโหลดรูปใหม่
                            });
                            setShowModal(true);          // เปิด modal
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(post.id)}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </figure>

                    <div className="p-5">
                      <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {post.name}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p className="flex items-center gap-2">
                          <MapPin size={14} className="text-purple-600" />
                          {post.location}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock size={14} className="text-purple-600" />
                          {new Date(post.datetime).toLocaleDateString("th-TH")}
                        </p>
                        <p>
                          <span className={post.gender === "ผู้" ? "text-blue-600" : "text-pink-600"}>
                            {post.gender === "ผู้" ? "♂" : "♀"}
                          </span>{" "}
                          {post.gender} • {post.age}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {post.details}
                      </p>


                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold hover:bg-purple-200 transition-all"
                          onClick={() => {
                            setEditMode(true);           // เปิดโหมดแก้ไข
                            setEditingCatId(post.id);    // เก็บ id ของแมวที่จะแก้ไข
                            setFormData({                // เติมข้อมูลลงใน form
                              name: post.name,
                              location: post.location,
                              datetime: post.datetime,
                              gender: post.gender,
                              details: post.details,
                              age: post.age,
                              image: post.images || [],
                              // ถ้าอยากอัปโหลดรูปใหม่
                            });
                            setShowModal(true);          // เปิด modal
                          }}
                        >
                          แก้ไข
                        </button>
                        <button className="flex-1 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold hover:bg-pink-200 transition-all">
                          แชร์
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "favorites" && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">💕</div>
              <p className="text-2xl text-gray-500 mb-4">ยังไม่มีรายการโปรด</p>
              <Link
                to="/adopt"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                ดูแมวทั้งหมด
              </Link>
            </div>
          )}

          {activeTab === "history" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adoptionHistory.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="text-8xl mb-6">📜</div>
                  <p className="text-2xl text-gray-500 mb-4">ยังไม่มีประวัติการรับเลี้ยง</p>
                </div>
              ) : (
                adoptionHistory.map(item => (
                  <div
                    key={item.id || item.catName + item.datetime} // fallback
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-white space-y-3"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{item.catName}</h3>

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Owner */}
                    <p className="text-sm text-gray-600">
                      Post By: <span className="font-medium">{item.owner}</span>
                    </p>

                    {/* Message */}
                    {item.message && (
                      <p className="text-gray-700">{item.message}</p>
                    )}

                    {/* Datetime */}
                    <p className="text-xs text-gray-400">
                      {item.datetime
                        ? new Date(item.datetime).toLocaleString()
                        : "Unknown Date"}
                    </p>

                    {/* Divider */}
                    {item.status === "pending" && (
                      <hr className="border-gray-200" />
                    )}

                    {/* Cancel Button */}
                    {item.status === "pending" && (
                      <button
                        onClick={() => cancelAdoptionRequest(item.id)}
                        className="
                flex items-center gap-2
                px-4 py-2 text-xs font-medium
                bg-gradient-to-r from-red-50 to-red-100
                text-red-700
                border border-red-200
                rounded-lg
                shadow-sm
                hover:shadow-md hover:scale-[1.02]
                hover:from-red-100 hover:to-red-200
                transition-all duration-200 ease-out
              "
                      >
                        ❌ ยกเลิกคำขอ
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "request" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownerRequests.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="text-8xl mb-6">📬</div>
                  <p className="text-2xl text-gray-500 mb-4">ยังไม่มีคำขออุปการะ</p>
                </div>
              ) : (
                ownerRequests.map(item => (
                  <div key={item.id} className="p-4 border rounded-lg shadow hover:shadow-lg transition duration-200 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">{item.catName}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${item.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      ผู้ขออุปการะ: <span className="font-medium">{item.adopter}</span>
                    </p>
                    <p className="text-gray-700 mb-2">{item.message || "ไม่มีข้อความ"}</p>
                    <p className="text-xs text-gray-400">
                      {item.datetime ? new Date(item.datetime).toLocaleString() : "Unknown Date"}
                    </p>

                    {item.status === "pending" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => approveRequest(item.id)}
                          className="flex-1 px-4 py-2 text-xs font-medium bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
                        >
                          ✅ อนุมัติ
                        </button>
                        <button
                          onClick={() => rejectRequest(item.id)}
                          className="flex-1 px-4 py-2 text-xs font-medium bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
                        >
                          ❌ ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}




        </section>

        {/* Add Cat Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-800 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-2xl font-black">เพิ่มน้องแมวใหม่</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    รูปภาพแมว
                  </label>
                  <div className="relative">
                    {/* <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      id="imageUpload"
                      /> */}
                    <Uploadfile form={formData} setForm={setFormData} />
                    {/* <label
                      htmlFor="imageUpload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-500 transition-all bg-purple-50 hover:bg-purple-100"
                      >
                      <Upload size={48} className="text-purple-400 mb-2" />
                      <span className="text-purple-600 font-semibold">
                      คลิกเพื่ออัพโหลดรูปภาพ
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                      PNG, JPG สูงสุด 5MB
                      </span>
                      </label> */}


                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ชื่อแมว *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="เช่น มิโล่"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    อายุแมว *
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="เช่น 1"
                    value={formData.age || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    สถานที่พบ *
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="เช่น กรุงเทพฯ"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Date & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      วันที่พบ
                    </label>
                    <input
                      type="datetime-local"
                      name="datetime"
                      value={formData.datetime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      เพศ
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="ผู้">ผู้</option>
                      <option value="เมีย">เมีย</option>
                      <option value="ไม่ทราบ">ไม่ทราบ</option>
                    </select>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    รายละเอียดเพิ่มเติม
                  </label>
                  <textarea
                    name="details"
                    placeholder="บอกเล่าเกี่ยวกับน้องแมว..."
                    value={formData.details}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-black hover:scale-101 transition-all"
                >
                  บันทึกข้อมูล
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default UserProfile;

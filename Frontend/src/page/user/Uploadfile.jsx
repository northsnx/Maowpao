import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UploadFile = ({ form, setForm }) => {

  const handleOnChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.post(
            "http://localhost:1112/api/v1/images/upload",
            { images: [reader.result] },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );

          setForm(prev => ({
            ...prev,
            image: [...prev.image, ...res.data.images]
          }));

          toast.success("Upload success!");

        } catch (err) {
          console.error("Upload failed:", err);
          toast.error("Upload failed");
        }
      };
    });
  };

  // ⭐ เพิ่มฟังก์ชันลบรูป
  const handleRemove = (index) => {
    setForm(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mt-4">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-indigo-400 transition">
        <span className="text-purple-600 font-semibold">
          คลิกเพื่ออัพโหลดรูปภาพ
        </span>
        <span className="text-sm text-gray-500 mt-1">
          PNG, JPG สูงสุด 5MB
        </span>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleOnChange}
        />
      </label>

      {/* Preview Images */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
        {form.image.map((url, idx) => (
          <div key={idx} className="relative group">
            <img
              src={url}
              alt={`uploaded-${idx}`}
              className="w-full h-24 object-cover rounded-xl shadow-md group-hover:brightness-75 transition"
            />

            <button
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 bg-black/60 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFile;

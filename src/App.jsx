import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const onSubmit = async (data) => {
    const { height, weight } = data;
    setLoading(true);

    // Hitung BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    const prompt = `Seseorang dengan tinggi ${height} cm dan berat ${weight} kg. Berikan advice kesehatan casual. (maksimal 150 kata)`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      setAdvice(response.text);
    } catch (error) {
      console.error("Error calling API:", error);
      setAdvice("Failed to generate advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            SehatKu AI
          </h1>
          <p className="text-gray-600 text-lg">Asisten Kesehatan Pintar Anda</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500"></div>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tinggi Badan (cm)
                <input
                  type="text"
                  {...register("height", {
                    required: "Tinggi badan harus diisi",
                  })}
                  className="mt-1 block px-3 w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Masukkan tinggi badan"
                />
              </label>
              {errors.height && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.height.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Berat Badan (kg)
                <input
                  type="text"
                  {...register("weight", {
                    required: "Berat badan harus diisi",
                  })}
                  className="mt-1 block px-3 w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Masukkan berat badan"
                />
              </label>
              {errors.weight && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {loading ? "Sedang Memproses..." : "Dapatkan Saran"}
            </button>
          </form>
        </div>

        {advice && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Saran Kesehatan:
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{advice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

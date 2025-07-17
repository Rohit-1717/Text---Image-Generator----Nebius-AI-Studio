import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [lastPrompt, setLastPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImage(null);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/generate`,
        {
          prompt,
        }
      );

      if (response.data && response.data.data?.imageUrl) {
        setImage(response.data.data.imageUrl);
        setLastPrompt(prompt); // store prompt to display below
        setPrompt(""); // clear the input
      } else {
        setError("Failed to generate image. Try again.");
        console.log("Backend Response:", response.data);
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Something went wrong while generating the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111] to-[#1a1a1a] text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl md:text-5xl font-bold text-amber-400 mb-8 text-center">
        Text to Image Generator
      </h1>

      {/* Input Box */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg">
        <input
          type="text"
          placeholder="Enter prompt..."
          className="w-full sm:flex-1 px-4 py-2 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none border border-white/20"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full sm:w-auto px-6 py-2 font-semibold rounded-xl text-black transition-all 
            ${
              isLoading
                ? "bg-amber-300 cursor-not-allowed flex items-center justify-center"
                : "bg-amber-400 hover:bg-amber-500"
            }`}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      {/* Output Image */}
      <div className="w-full max-w-3xl mt-10 p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg min-h-[300px] flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="w-full h-[300px] bg-gray-800 animate-pulse rounded-2xl" />
        ) : image ? (
          <>
            <img
              src={image}
              alt="Generated"
              className="rounded-xl w-full max-h-[400px] object-contain shadow-xl"
            />
            <button
              onClick={handleDownload}
              className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all"
            >
              Download Image
            </button>
          </>
        ) : error ? (
          <p className="text-red-400 text-xl">{error}</p>
        ) : (
          <p className="text-gray-400 text-xl text-center">
            Enter a prompt and generate an image
          </p>
        )}
      </div>

      {/* Prompt Display */}
      {lastPrompt && !isLoading && image && (
        <p className="mt-4 text-sm text-gray-400 italic text-center max-w-xl">
          Prompt: {lastPrompt}
        </p>
      )}
    </div>
  );
}

export default Home;

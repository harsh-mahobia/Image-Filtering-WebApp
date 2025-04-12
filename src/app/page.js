// app/page.jsx (no TypeScript, no UI library)
"use client";

import { useRef, useState, useEffect } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);
  const [filterType, setFilterType] = useState("none");
  const [intensity, setIntensity] = useState(100);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageURL(reader.result);
        setFilterType("none");
        setIntensity(100);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = (type = filterType, value = intensity) => {
    setFilterType(type);
    setIntensity(value);

    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const displayWidth = 400;
      const scale = displayWidth / image.width;
      const displayHeight = image.height * scale;

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      let filter = "none";
      if (type === "grayscale") filter = `grayscale(${value}%)`;
      else if (type === "brightness") filter = `brightness(${value}%)`;
      else if (type === "blur") filter = `blur(${(value / 100) * 10}px)`;

      ctx.filter = filter;
      ctx.drawImage(image, 0, 0, displayWidth, displayHeight);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "filtered-image.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    if (imageURL) applyFilter();
  }, [intensity]);

  const buttonClass =
    "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition";

  return (
    <main className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Image Filter App</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageURL && (
        <>
          <img
            ref={imageRef}
            src={imageURL}
            alt="uploaded"
            onLoad={() => applyFilter()}
            style={{ display: "none" }}
          />

          <canvas ref={canvasRef} className="border rounded shadow w-full max-w-[250px] h-auto" />

          <div className="flex flex-wrap gap-2 mt-2">
            <button className={buttonClass} onClick={() => applyFilter("none", 100)}>Original</button>
            <button className={buttonClass} onClick={() => applyFilter("grayscale", intensity)}>Grayscale</button>
            <button className={buttonClass} onClick={() => applyFilter("brightness", intensity)}>Bright</button>
            <button className={buttonClass} onClick={() => applyFilter("blur", intensity)}>Blur</button>
          </div>

          {(filterType !== "none") && (
            <div className="w-full max-w-[400px] mt-4">
              <label className="block text-sm font-medium mb-1 text-center">
                Adjust Intensity ({intensity}{filterType === 'blur' ? 'px' : '%'})
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={intensity}
                onChange={(e) => applyFilter(filterType, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <button className={`${buttonClass} mt-4`} onClick={downloadImage}>
            Download Image
          </button>
        </>
      )}
    </main>
  );
}
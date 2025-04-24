import { useState, useRef, useEffect } from 'react';
import AIImageGenerator from './AIImageGenerator';
import styles from '../styles/ImageFilter.module.css';

export default function ImageFilter() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('/placeholder.jpg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    blur: 0,
    invert: 0
  });
  const [presets, setPresets] = useState([
    { name: 'Normal', values: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, hueRotate: 0, blur: 0, invert: 0 } },
    { name: 'Vintage', values: { brightness: 110, contrast: 85, saturation: 75, grayscale: 0, sepia: 50, hueRotate: 0, blur: 0, invert: 0 } },
    { name: 'B&W', values: { brightness: 100, contrast: 120, saturation: 0, grayscale: 100, sepia: 0, hueRotate: 0, blur: 0, invert: 0 } },
    { name: 'Dramatic', values: { brightness: 110, contrast: 130, saturation: 130, grayscale: 0, sepia: 0, hueRotate: 0, blur: 0, invert: 0 } },
    { name: 'Cyberpunk', values: { brightness: 100, contrast: 110, saturation: 150, grayscale: 0, sepia: 0, hueRotate: 180, blur: 0, invert: 0 } }
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [filterHistory, setFilterHistory] = useState([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(file);
        setImageUrl(reader.result);
        // Reset filters when new image is uploaded
        applyPreset(presets[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle AI generated image
  const handleAIGeneratedImage = (url) => {
    setImageUrl(url);
    setShowAIGenerator(false);
    // Reset filters when new image is generated
    applyPreset(presets[0]);
  };

  // Apply filter style
  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        grayscale(${filters.grayscale}%) 
        sepia(${filters.sepia}%) 
        hue-rotate(${filters.hueRotate}deg) 
        blur(${filters.blur}px) 
        invert(${filters.invert}%)
      `
    };
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  // Apply preset filter
  const applyPreset = (preset) => {
    // Save current filter to history before applying new one
    if (JSON.stringify(filters) !== JSON.stringify(preset.values)) {
      setFilterHistory([...filterHistory, { ...filters, timestamp: new Date().toLocaleTimeString() }]);
    }
    setFilters(preset.values);
  };

  // Restore filter from history
  const restoreFilter = (historicFilter) => {
    const { timestamp, ...filterValues } = historicFilter;
    setFilters(filterValues);
  };

  // Download the filtered image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (canvas && image) {
      const ctx = canvas.getContext('2d');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      
      // Apply filters to canvas
      ctx.filter = `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        grayscale(${filters.grayscale}%) 
        sepia(${filters.sepia}%) 
        hue-rotate(${filters.hueRotate}deg) 
        blur(${filters.blur}px) 
        invert(${filters.invert}%)
      `;
      
      ctx.drawImage(image, 0, 0);
      
      // Create download link
      const link = document.createElement('a');
      link.download = 'filtered-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Save current filter as new preset
  const savePreset = () => {
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
      setPresets([...presets, { name: presetName, values: { ...filters } }]);
    }
  };

  // Toggle AI image generator
  const toggleAIGenerator = () => {
    setShowAIGenerator(!showAIGenerator);
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadContainer}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className={styles.fileInput}
          id="imageUpload"
        />
        <label htmlFor="imageUpload" className={styles.uploadButton}>
          Upload Image
        </label>
        <button 
          onClick={toggleAIGenerator} 
          className={`${styles.uploadButton} ${styles.aiButton}`}
        >
          {showAIGenerator ? 'Hide AI Generator' : 'Generate with AI'}
        </button>
      </div>

      {showAIGenerator && (
        <AIImageGenerator onImageGenerated={handleAIGeneratedImage} />
      )}

      <div className={styles.workspaceContainer}>
        <div className={styles.imageContainer}>
          <img 
            ref={imageRef}
            src={imageUrl} 
            alt="Preview" 
            style={getFilterStyle()} 
            className={styles.previewImage}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>

        <div className={styles.controlsContainer}>
          <div className={styles.presetSection}>
            <h3>Presets</h3>
            <div className={styles.presetButtons}>
              {presets.map((preset, index) => (
                <button 
                  key={index} 
                  onClick={() => applyPreset(preset)}
                  className={styles.presetButton}
                >
                  {preset.name}
                </button>
              ))}
              {/* <button onClick={savePreset} className={styles.savePresetButton}>
                Save Current
              </button> */}
            </div>
          </div>

          <div className={styles.sliderContainer}>
            <div className={styles.sliderGroup}>
              <label>Brightness: {filters.brightness}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.brightness}
                onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Contrast: {filters.contrast}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.contrast}
                onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Saturation: {filters.saturation}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.saturation}
                onChange={(e) => handleFilterChange('saturation', parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Grayscale: {filters.grayscale}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.grayscale}
                onChange={(e) => handleFilterChange('grayscale', parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Sepia: {filters.sepia}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.sepia}
                onChange={(e) => handleFilterChange('sepia', parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Hue Rotate: {filters.hueRotate}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={filters.hueRotate}
                onChange={(e) => handleFilterChange('hueRotate', parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Blur: {filters.blur}px</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={filters.blur}
                onChange={(e) => handleFilterChange('blur', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <label>Invert: {filters.invert}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.invert}
                onChange={(e) => handleFilterChange('invert', parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button onClick={downloadImage} className={styles.downloadButton}>
              Download Image
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className={styles.historyButton}
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>

          {showHistory && (
            <div className={styles.historyContainer}>
              <h3>Filter History</h3>
              {filterHistory.length === 0 ? (
                <p>No history yet. Apply filters to see history.</p>
              ) : (
                <div className={styles.historyList}>
                  {filterHistory.map((hist, index) => (
                    <div 
                      key={index} 
                      className={styles.historyItem}
                      onClick={() => restoreFilter(hist)}
                    >
                      <span>Filter #{index + 1} - {hist.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import styles from '../styles/AIImageGenerator.module.css';

export default function AIImageGenerator({ onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([
    'sunset over mountains',
    'futuristic cityscape',
    'abstract art with vibrant colors',
    'serene beach with palm trees',
    'lush forest with waterfall',
    'space nebula with stars'
  ]);

  const generateImage = async (promptText) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      
      const data = await response.json();
      onImageGenerated(data.imageUrl);
    } catch (err) {
      setError('Error generating image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateImage(prompt);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
    generateImage(suggestion);
  };

  return (
    <div className={styles.aiGeneratorContainer}>
      <h3>AI Image Generator</h3>
      <p className={styles.description}>
        Enter a description of the image you want to generate
      </p>
      
      <form onSubmit={handleSubmit} className={styles.promptForm}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a description..."
          className={styles.promptInput}
          disabled={loading}
        />
        <button 
          type="submit" 
          className={styles.generateButton}
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      <div className={styles.suggestionsContainer}>
        <h4>Try these suggestions:</h4>
        <div className={styles.suggestionTags}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={styles.suggestionTag}
              disabled={loading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}



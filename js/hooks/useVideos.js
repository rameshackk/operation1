import { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { getLatestVideos } from '../services/youtubeService.js';
import { useLanguage } from '../context/LanguageContext.js';

export function useVideos(category = "all") {
  const { language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getLatestVideos(language, category)
      .then(data => {
        if (isMounted) {
          setVideos(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [language, category]);

  return { videos, isLoading, error };
}

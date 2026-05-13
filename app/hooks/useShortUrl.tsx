import { useState } from "react";

export const useShortUrl = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newUrl, setNewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const shortUrl = async (longUrl: string) => {
    setNewUrl("");
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/short", {
        method: "POST",
        body: JSON.stringify({ long_url: longUrl }),
      });
      setIsLoading(false);
      const data = await response.json();
      setNewUrl(data.short_url);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { shortUrl, isLoading, newUrl, error };
};

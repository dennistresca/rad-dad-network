import { useEffect, useState } from "react";
import { fetchFeedEpisodes } from "../utils/parseRssFeed";

// Fetches one show's latest episodes directly from its RSS feed at render
// time. `episodes` stays null while loading; becomes [] (with `error` set)
// if the feed request fails, so callers can show a friendly fallback
// instead of stale or fabricated data.
export function useShowEpisodes(feedUrl, maxCount = 4) {
  const [episodes, setEpisodes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setEpisodes(null);
    setError(null);

    fetchFeedEpisodes(feedUrl, maxCount)
      .then((result) => {
        if (cancelled) return;
        setEpisodes(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setEpisodes([]);
      });

    return () => {
      cancelled = true;
    };
  }, [feedUrl, maxCount]);

  return { episodes, error, loading: episodes === null && !error };
}

// Fetches all shows' feeds in parallel and returns the single most recent
// episode network-wide, for the homepage hero.
export function useLatestNetworkEpisode(shows) {
  const [latest, setLatest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLatest(null);
    setError(null);

    Promise.all(
      shows.map((show) =>
        fetchFeedEpisodes(show.feedUrl, 1)
          .then((episodes) => (episodes[0] ? { ...episodes[0], show } : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      const found = results.filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
      if (found.length === 0) {
        setError(new Error("No episodes could be loaded"));
        return;
      }
      setLatest(found[0]);
    });

    return () => {
      cancelled = true;
    };
  }, [shows]);

  return { latest, error, loading: latest === null && !error };
}

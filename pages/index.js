import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styled from "styled-components";
import { useDebounce } from "use-debounce";
import MovieCard from "../components/MovieCard";

// Styled components
const Input = styled.input`
  padding: 0.2rem;
  border-radius: 4px;
  width: 100%;
  line-height: 1.5;
`;

const WatchlistContainer = styled.div`
  margin-top: 2rem;
`;

export default function HomePage() {
  // Fetcher function
  const fetcher = (url) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    });

  // State
  const [input, setInput] = useState("");
  const [debouncedInput] = useDebounce(input, 300);
  const [moviesData, setMoviesData] = useState({});
  const [imdbIds, setImdbIds] = useState([]);

  // SWR data fetching
  const { data: netzkinoData, error: netzkinoError } = useSWR(
    debouncedInput
      ? `https://api.netzkino.de.simplecache.net/capi-2.0a/search?q=${debouncedInput
          .split(" ")
          .join("+")}&d=devtest`
      : null,
    fetcher
  );

  // Extract IMDb IDs when data is fetched
  useEffect(() => {
    if (netzkinoData) {
      const imdbLinks = netzkinoData.posts
        .map((movie) => {
          const imdbLink = movie.custom_fields["IMDb-Link"][0];
          return imdbLink.match(/tt\d+/)?.[0] || null;
        })
        .filter(Boolean);

      setImdbIds(imdbLinks);
    }
  }, [netzkinoData]);

  // Fetch movies data from TMDB using IMDb IDs
  useEffect(() => {
    if (imdbIds.length > 0) {
      const fetchMovieData = async () => {
        const requests = imdbIds.map((id) =>
          fetch(
            `https://api.themoviedb.org/3/find/${id}?api_key=78247849b9888da02ffb1655caa3a9b9&language=de&external_source=imdb_id`
          ).then((res) => res.json())
        );

        const results = await Promise.all(requests);
        const movieDataById = imdbIds.reduce((acc, id, index) => {
          acc[id] = results[index];
          return acc;
        }, {});

        setMoviesData(movieDataById);
      };

      fetchMovieData();
    }
  }, [imdbIds]);

  // Render states
  if (!netzkinoData && debouncedInput && !netzkinoError)
    return <div>Loading data...</div>;
  if (netzkinoError) return <div>Error loading data!</div>;

  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a movie..."
      />

      {/* Render Search Results */}
      {imdbIds.map((imdbId) =>
        moviesData[imdbId] ? (
          <MovieCard key={imdbId} movie={moviesData[imdbId]} />
        ) : (
          <p key={imdbId}>Loading data for IMDb ID: {imdbId}...</p>
        )
      )}
    </div>
  );
}

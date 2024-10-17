import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styled from "styled-components";
import { useDebounce } from "use-debounce";
import Image from "next/image";

const Input = styled.input`
  padding: 0.2rem;
  border-radius: 4px;
  width: 100%;
  line-height: 1.5;
`;

const Box = styled.div`
  max-width: 500px;
`;

// Fetcher function
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });

export default function HomePage() {
  const [urlNetzkino, setUrlNetzkino] = useState(null);
  const [imdbIds, setImdbIds] = useState([]);
  const [moviesData, setMoviesData] = useState({});
  const { data: data1, error: error1 } = useSWR(urlNetzkino || null, fetcher);
  const [input, setInput] = useState("");
  const [debouncedInput] = useDebounce(input, 300);

  // Effect to update urlNetzkino when debounced input changes
  useEffect(() => {
    if (debouncedInput) {
      const replaceSpacesWithPlus = (input) => input.split(" ").join("+");
      const transformedValue = replaceSpacesWithPlus(debouncedInput);
      setUrlNetzkino(
        `https://api.netzkino.de.simplecache.net/capi-2.0a/search?q=${transformedValue}&d=devtest`
      );
    } else {
      setUrlNetzkino(null);
    }
  }, [debouncedInput]);

  useEffect(() => {
    if (data1) {
      console.log("data1", data1);

      const imdbLinks = data1.posts
        .map((movie) => {
          const imdbLink = movie.custom_fields["IMDb-Link"][0];
          const imdbIdMatch = imdbLink.match(/tt\d+/);
          if (imdbIdMatch) {
            return imdbIdMatch[0]; // Return the 'tt' ID
          } else {
            console.error("No valid IMDb ID found in the link:", imdbLink);
            return null;
          }
        })
        .filter(Boolean); // Remove null values

      console.log("imdbIds", imdbLinks);
      setImdbIds(imdbLinks); // Store the IMDb IDs in state
    }
  }, [data1]);

  // Fetch data for each IMDb ID dynamically and store in state
  useEffect(() => {
    if (imdbIds.length > 0) {
      // Loop through each imdbId and fetch movie data
      imdbIds.forEach((imdbId) => {
        const url2 = `https://api.themoviedb.org/3/find/${imdbId}?api_key=78247849b9888da02ffb1655caa3a9b9&language=de&external_source=imdb_id`;

        fetch(url2)
          .then((res) => res.json())
          .then((movieData) => {
            setMoviesData((prevData) => ({
              ...prevData,
              [imdbId]: movieData, // Store movie data using the imdbId as the key
            }));
          })
          .catch((error) => {
            console.error(`Error fetching movie data for ${imdbId}`, error);
          });
      });
    }
  }, [imdbIds]);

  // Handle loading and error states
  if (!data1 && !error1 && urlNetzkino)
    return <div>Loading data from first URL...</div>;
  if (error1) {
    console.error("Error loading data from first URL!", error1);
    return <div>Error loading data from first URL!</div>;
  }

  // bypass next/Image components domain restriction! Caution! Security concern.
  const customLoader = ({ src }) => {
    return src;
  };

  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a movie..."
      />
      <br />
      {/* Render fetched movie data for each IMDb ID */}
      {imdbIds.map((imdbId) => (
        <div key={imdbId}>
          {moviesData[imdbId] ? (
            <Box>
              <h3>
                Movie Title:{" "}
                {moviesData[imdbId]?.movie_results?.[0]?.title || "Unknown"}
              </h3>
              <Image
                unoptimized={customLoader}
                src={
                  `https://image.tmdb.org/t/p/w500${moviesData[imdbId]?.movie_results?.[0]?.poster_path}` ||
                  "No overview available"
                }
                alt={moviesData[imdbId]?.movie_results?.[0]?.title}
                layout="responsive"
                width={100}
                height={100}
              />
            </Box>
          ) : (
            <p>Loading data for IMDb ID: {imdbId}...</p>
          )}
        </div>
      ))}
    </div>
  );
}

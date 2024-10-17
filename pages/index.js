import React, { useState, useEffect } from "react";
import useSWR from "swr";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

const Input = styled.input`
  padding: 0.2rem;
  border-radius: 4px;
  width: 100%;
  line-height: 1.5;
`;

export default function HomePage() {
  // Data fetching
  const [url, setUrl] = useState(null);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(url, fetcher, { shouldRetryOnError: false });
  const isLoading = !error && !data && !!url;

  // State for search input
  const [input, setInput] = useState("");
  const [debouncedInput] = useDebounce(input, 300); // Debounce input for 300ms

  // Effect to update URL when debounced input changes
  useEffect(() => {
    if (debouncedInput) {
      const replaceSpacesWithPlus = (input) => {
        return input.split(" ").join("+");
      };
      const transformedValue = replaceSpacesWithPlus(debouncedInput);
      setUrl(
        `https://api.netzkino.de.simplecache.net/capi-2.0a/search?q=${transformedValue}&d=devtest`
      );
    } else {
      setUrl(null); // Clear the URL if input is empty
    }
  }, [debouncedInput]);

  const imdbLinks = data?.posts.map((movie) => {
    return movie.custom_fields["IMDb-Link"][0].replace(
      "http:/www.imdb.com/title/",
      ""
    );
  });
  console.log(imdbLinks);

  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a movie..."
      />
      <br />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching data</p>}
      {data &&
        data.posts.map((movie, index) => (
          <ul key={index} movie={movie}>
            title: {movie.title}
          </ul>
        ))}
    </div>
  );
}

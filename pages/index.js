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

import React, { useState } from "react";
import useSWR from "swr";
import InputComp from "@/components/SearchInput/SearchInput";
import styled from "styled-components";

export default function HomePage() {
  // Data fetching
  const [url, setUrl] = useState(null);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(url, fetcher, { shouldRetryOnError: false });
  const isLoading = !error && !data && !!url;

  // Search
  function handleChange(e) {
    const input = e.target.value;
    const replaceSpacesWithPlus = (input) => {
      return input.split(" ").join("+");
    };
    const transformedValue = replaceSpacesWithPlus(input);
    setUrl(
      `https://api.netzkino.de.simplecache.net/capi-2.0a/search?q=${transformedValue}&d=devtest`
    );
  }

  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <input onChange={handleChange} />
      <br />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error fetching data</p>}
      {data &&
        data.posts.map((movie, index) => (
          <div key={index} movie={movie}>
            title: {movie.title},{" "}
          </div>
        ))}
    </div>
  );
}

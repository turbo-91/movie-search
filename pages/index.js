import React from "react";
import useSWR from "swr";
import InputComp from "@/components/SearchInput/SearchInput";
import { useState } from "react";
import styled from "styled-components";

export default function HomePage() {
  const [keyWords, setKeywords] = useState("blanchett");

  // Data fetching
  const [url, setUrl] = useState(null);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(url, fetcher, { shouldRetryOnError: false });
  const isLoading = !error && !data && !!url;

  // Keyword Search
  const handleSearch = () => {
    setUrl(
      `https://api.netzkino.de.simplecache.net/capi-2.0a/search?q=${keyWords}&d=devtest`
    );
    console.log("url", url);
  };

  return (
    <div>
      <InputComp
        id="keywords"
        value={keyWords}
        onChange={(e) => setKeywords(e.target.value)}
      />
    </div>
  );
}

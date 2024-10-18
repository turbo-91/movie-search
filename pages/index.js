import React, { useState } from "react";
import styled from "styled-components";
import MovieCard from "../components/MovieCard";
import { useMovies } from "@/hooks/useMovies";

// Styled components
const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  border: 1px solid #ccc;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const CenteredContainer = styled.div`
  text-align: center;
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
`;

export default function HomePage() {
  const [input, setInput] = useState("");
  const { moviesData, imdbIds, netzkinoError, loading } = useMovies(input); // Use custom hook

  // Render states
  if (loading) return <div>Loading data...</div>;
  if (netzkinoError) return <div>Error loading data!</div>;

  return (
    <CenteredContainer>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a movie..."
      />

      {/* Render Search Results */}
      <MovieGrid>
        {imdbIds.map((imdbId) =>
          moviesData[imdbId] ? (
            <MovieCard key={imdbId} movie={moviesData[imdbId]} />
          ) : (
            <p key={imdbId}>Loading data for IMDb ID: {imdbId}...</p>
          )
        )}
      </MovieGrid>
    </CenteredContainer>
  );
}

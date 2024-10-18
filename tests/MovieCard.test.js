import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for better matchers
import MovieCard from "@/components/MovieCard.js";

const mockMovie = {
  movie_results: [
    {
      title: "Test Movie",
      poster_path: "/testposter.jpg",
    },
  ],
};

describe("MovieCard - Static Elements", () => {
  test("renders the movie card container (Box)", () => {
    render(<MovieCard movie={mockMovie} />);

    const boxElement = screen.getByRole("article");
    expect(boxElement).toBeInTheDocument();
    expect(boxElement).toHaveStyle(`
      max-width: 500px;
      margin-bottom: 1rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    `);
  });

  test("renders the movie title", () => {
    render(<MovieCard movie={mockMovie} />);

    const titleElement = screen.getByText("Test Movie");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveStyle(`
      font-family: "Helvetica",sans-serif;  
      text-align: left;
      font-size: 1.5rem;
    `);
  });

  test("renders the poster image", () => {
    render(<MovieCard movie={mockMovie} />);

    const posterImageElement = screen.getByRole("img");
    expect(posterImageElement).toBeInTheDocument();
    expect(posterImageElement).toHaveStyle(`
      width: 100%;
      height: auto;
      border-radius: 8px;
    `);
  });
});

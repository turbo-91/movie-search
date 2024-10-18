import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for better matchers
import HomePage from "@/pages/Homepage";

jest.mock("../components/MovieCard", () => () => <div>Mocked MovieCard</div>);

describe("HomePage static elements", () => {
  test("renders the input field", () => {
    render(<HomePage />);
    const inputElement = screen.getByTestId("search-input");
    expect(inputElement).toBeInTheDocument();
  });

  test("renders the input field with correct styles", () => {
    render(<HomePage />);
    const inputElement = screen.getByTestId("search-input");
    expect(inputElement).toHaveStyle(`
      padding: 0.5rem;
      border-radius: 4px;
      width: 100%;
      max-width: 600px;
      margin: 1rem auto;
      border: 1px solid #ccc;
    `);
  });

  test("renders the centered container", () => {
    render(<HomePage />);
    const inputElement = screen.getByTestId("search-input");
    const containerElement = inputElement.closest("div");
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveStyle(`
      text-align: center;
      max-width: 1200px;
      margin: auto;
      padding: 1rem;
    `);
  });

  test("renders the movie grid container", () => {
    render(<HomePage />);
    const movieGridElement = screen.getByRole("grid");
    expect(movieGridElement).toBeInTheDocument();
    expect(movieGridElement).toHaveStyle(`
      display: grid;
      gap: 1rem;
      max-width: 1200px;
      margin: 2rem auto;
    `);
  });
});

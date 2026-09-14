import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./main.jsx";

vi.mock("./api", () => ({
  API_BASE_URL: "http://localhost:5000",
  createShortLink: vi.fn(),
  getRecentLinks: vi.fn(() => Promise.resolve({ links: [] }))
}));

describe("App", () => {
  it("renders the shortener form and recent links panel", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /short links, forged fast/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/destination url/i)).toBeInTheDocument();
    expect(await screen.findByText(/no links yet/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page", () => {
  render(<App />);
  expect(screen.getByText(/IT Infrastructure System/i)).toBeInTheDocument();
});

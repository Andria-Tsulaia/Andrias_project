
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply the saved theme before React renders.
const savedTheme = localStorage.getItem("app_theme");

document.documentElement.classList.toggle(
  "dark",
  savedTheme === "dark"
);

document.documentElement.style.colorScheme =
  savedTheme === "dark" ? "dark" : "light";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root was not found.");
}

createRoot(container).render(<App />);

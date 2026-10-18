import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import type { PageId } from "./site";
import "./styles.css";

export function mount(page: PageId, content: ReactNode) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode><App page={page}>{content}</App></StrictMode>,
  );
}

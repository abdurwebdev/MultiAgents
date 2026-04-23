import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App";
import { RouterProvider } from "react-router";
import router from "./app/App.routes";
import { Toaster } from "sonner";
createRoot(document.getElementById("root")).render(
  <>
    <Toaster  position="top-right" />
    <RouterProvider router={router} />
    <App/>
  </>
);
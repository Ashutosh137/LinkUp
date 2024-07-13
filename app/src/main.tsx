import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import UseThemeProvider from "./theme/themeprovider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UseThemeProvider>
      <Toaster />
      <App />
    </UseThemeProvider>
  </React.StrictMode>,
);

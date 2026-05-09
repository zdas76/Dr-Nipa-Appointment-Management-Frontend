import { GlobalStyles, StyledEngineProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { routes } from "./layout/router";
import { store } from "./retux/store";
import './index.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <Provider store={store}>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <RouterProvider router={routes} />
      </Provider>
      <Toaster position="top-center" />
    </StyledEngineProvider>
  </StrictMode>,
);

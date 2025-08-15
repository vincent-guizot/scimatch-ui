// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Matches from "./pages/Matches";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/matches",
    element: <Matches />
  }
]);

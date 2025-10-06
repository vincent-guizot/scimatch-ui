// router.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Matches from "../pages/Matches";
import MemberLayout from "../layouts/MemberLayout";
import Members from "../pages/Admin/Members";
import AddMember from "../pages/Admin/AddMember";
import EditMember from "../pages/Admin/EditMember";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/matches",
    element: <Matches />,
  },
  {
    path: "/members",
    element: <MemberLayout />,
    children: [
      {
        path: "",
        element: <Members />,
      },
      {
        path: "add",
        element: <AddMember />,
      },
      {
        path: "edit/:id",
        element: <EditMember />,
      },
    ],
  },
]);

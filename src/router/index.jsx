// router.jsx
import { createBrowserRouter } from "react-router-dom";

// Layout
import MemberLayout from "../layouts/MemberLayout";

// Pages
import Login from "../pages/Login";
import MatchMaking from "../pages/MatchMaking";
import Matches from "../pages/Matches";
import Members from "../pages/Admin/Members";
import AddMember from "../pages/Admin/AddMember";
import EditMember from "../pages/Admin/EditMember";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/matchmaking",
    element: <MatchMaking />,
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

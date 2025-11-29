import {
  LuLayoutDashboard,
  LuHandcoin,
  LuWalletMinimal,
  LuLogout,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Manage User",
    icon: LuWalletMinimal,
    path: "/manageUser",
  },
  {
    id: "03",
    label: "Adoption Requests",
    icon: LuHandcoin,
    path: "/adoptionRequests",
  },
  {
    id: "04",
    label: "Inforation Cat",
    icon: LuHandcoin,
    path: "/informationCat",
  },
  {
    id: "09",
    label: "Logout",
    icon: LuLogout,
    path: "logout",
  },
];

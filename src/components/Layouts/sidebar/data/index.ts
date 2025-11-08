import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Upload & Analyze",
        icon: Icons.UploadIcon,
        url: "/upload",
        items: [],
      },
      {
        title: "Cases",
        icon: Icons.CasesIcon,
        url: "/cases",
        items: [],
      },
      {
        title: "Policies Library",
        icon: Icons.PoliciesIcon,
        url: "/policies",
        items: [],
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        title: "Security & Settings",
        icon: Icons.SecurityIcon,
        url: "/security",
        items: [],
      },
      {
        title: "Help / FAQ",
        icon: Icons.HelpIcon,
        url: "/help",
        items: [],
      },
    ],
  },
];


export const modalDemos = [
  {
    title: "Create AI Avatar",
    description: "Generate your 3D avatar from a face photo + measurements",
    route: "/(tabs)/(home)/avatar-generator",
    color: "#00D9C0",
    icon: "person.fill.viewfinder",
  },
  {
    title: "Virtual Try-On",
    description: "See how clothes look on your AI avatar",
    route: "/modal",
    color: "#FF4081",
    icon: "tshirt.fill",
  },
  {
    title: "My Wardrobe",
    description: "Manage your saved outfits and clothing items",
    route: "/formsheet",
    color: "#9C27B0",
    icon: "square.grid.2x2.fill",
  },
];

export type ModalDemo = typeof modalDemos[0];

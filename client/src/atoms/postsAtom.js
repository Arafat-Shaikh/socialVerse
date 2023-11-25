import { atom } from "recoil";

const postsAtom = atom({
  key: "postState",
  default: [],
});

export default postsAtom;

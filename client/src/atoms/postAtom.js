import { atom } from "recoil";

const postAtom = atom({
  key: "postState",
  default: JSON.parse(localStorage.getItem("post-d")),
});

export default postAtom;

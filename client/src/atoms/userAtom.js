import { atom } from "recoil";

const userAtom = atom({
  key: "userState",
  default: JSON.parse(localStorage.getItem("user-d")),
});

export default userAtom;

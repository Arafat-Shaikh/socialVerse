import { atom } from "recoil";

const authState = atom({
  key: "authState",
  default: "login",
});

export default authState;

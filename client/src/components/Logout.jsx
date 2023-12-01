import { Button } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { FiLogOut } from "react-icons/fi";
import useToastHook from "../hooks/useToastHook";

const Logout = () => {
  const { showToast } = useToastHook();
  const [user, setUser] = useRecoilState(userAtom);
  async function handleLogout() {
    if (!window.confirm("Press ok to logout")) return;
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      const data = await res.json();

      if (data.error) {
        showToast("error", data.error, true);
      } else {
        localStorage.removeItem("user-d");
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Button size={"xs"} onClick={handleLogout}>
      <FiLogOut size={20} />
    </Button>
  );
};

export default Logout;

import { Button, useToast } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const Logout = () => {
  const toast = useToast();
  const [user, setUser] = useRecoilState(userAtom);
  async function handleLogout() {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        toast({
          title: `${data.error}`,
          status: "error",
          isClosable: true,
        });
      } else {
        localStorage.removeItem("user-d");
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;

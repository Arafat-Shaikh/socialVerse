import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const toast = useToast();

  async function getUserProfile() {
    try {
      const res = await fetch("api/user/profile/" + username);
      const data = await res.json();

      if (data.error) {
        toast({
          title: data.error,
          status: "error",
          isClosable: true,
        });
      } else {
        console.log(data);
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserProfile();
  }, [username]);
  return { user };
};

export default useGetUserProfile;

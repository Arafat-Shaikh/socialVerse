import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useToastHook from "./useToastHook";

const useGetUserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const { showToast } = useToastHook();

  useEffect(() => {
    async function getUserProfile() {
      try {
        const res = await fetch("/api/user/profile/" + username);
        const data = await res.json();

        if (data.error) {
          showToast("error", data.error, true);
        } else {
          console.log(data);
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getUserProfile();
  }, [username]);

  return { user, loading };
};

export default useGetUserProfile;

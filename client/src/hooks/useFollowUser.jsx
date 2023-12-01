import { useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useToastHook from "./useToastHook";

const useFollowUser = () => {
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);
  const [follow, setFollow] = useState(null);
  const { showToast } = useToastHook();

  async function followUser(user) {
    setFollow(user?.followers.includes(loggedInUser.id));

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("api/user/follow/" + user.id, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        showToast("error", data.error, true);
      }

      if (follow) {
        user.followers.pop();
      } else {
        user.followers.push(loggedInUser._id);
      }

      setFollow(!follow);

      showToast("success", data.message, true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return { followUser, loading, follow };
};

export default useFollowUser;

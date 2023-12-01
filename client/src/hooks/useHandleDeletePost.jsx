import { useState } from "react";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";
import useToastHook from "./useToastHook";

const useHandleDeletePost = () => {
  const { showToast } = useToastHook();
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  const handleDeletePost = async (e, postId) => {
    e.preventDefault();
    if (!window.confirm("This can't be undone.")) return;
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/post/delete/" + postId, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        showToast("error", "failed to Delete post", true);
        setIsDeleted(false);
      } else {
        showToast("success", "Post deleted", true);

        const updatedPosts = posts.filter((p) => p.id !== postId);
        setPosts(updatedPosts);

        setIsDeleted(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return { handleDeletePost, isDeleted, loading };
};

export default useHandleDeletePost;

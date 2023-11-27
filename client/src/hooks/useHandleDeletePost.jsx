import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";

const useHandleDeletePost = () => {
  const toast = useToast();
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
        toast({
          status: "error",
          description: "failed to Delete post",
          isClosable: true,
        });
        setIsDeleted(false);
      } else {
        toast({
          status: "success",
          description: "Post deleted",
          isClosable: true,
        });

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

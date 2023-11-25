import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";

const useHandleDeletePost = () => {
  const toast = useToast();
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeletePost = async (postId) => {
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
        setIsDeleted(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return { handleDeletePost, isDeleted, loading };
  };
};

export default useHandleDeletePost;

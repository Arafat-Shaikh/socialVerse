import { Button, Flex, Spinner, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import UserPost from "../components/UserPost";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  async function getFollowedUserPosts() {
    try {
      const res = await fetch("/api/post/users/posts");
      const data = await res.json();

      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setPosts(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFollowedUserPosts();
  }, [user]);

  console.log(posts);

  if (!posts.length) {
    return (
      <Flex justifyContent={"center"}>
        <h1>Follow to see posts</h1>
      </Flex>
    );
  }

  return (
    <>
      {posts &&
        posts.map((post) => <UserPost post={post} setPosts={setPosts} />)}
    </>
  );
};

export default HomePage;

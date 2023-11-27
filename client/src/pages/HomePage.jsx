import {
  Avatar,
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import UserPost from "../components/UserPost";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFollowedUserPosts();
  }, [user]);

  console.log(posts);

  if (!posts.length && !user?.following) {
    return (
      <Flex justifyContent={"center"}>
        <h1>Follow to see posts</h1>
      </Flex>
    );
  }

  if (loading && user?.following) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}></Spinner>
      </Flex>
    );
  }

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {posts &&
          posts.map((post) => <UserPost post={post} setPosts={setPosts} />)}
      </Box>
      <Box flex={30} display={{ base: "none", md: "block" }}>
        <Text mb={2}>Suggested users</Text>
        <Flex direction={"column"}>
          <SuggestedUsers />
        </Flex>
      </Box>
    </Flex>
  );
};

export default HomePage;

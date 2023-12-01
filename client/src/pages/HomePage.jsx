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
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import UserPost from "../components/UserPost";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const toast = useToast();
  const [forYouPosts, setForYouPosts] = useState(false);

  async function getFollowedUserPosts() {
    setLoading(true);
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

  async function getForYouPosts() {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/post/filtered");
      const data = await response.json();

      if (data.error) {
        toast({
          status: "error",
          description: data.error,
          isClosable: true,
        });
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!forYouPosts) {
      getFollowedUserPosts();
    } else {
      getForYouPosts();
    }
  }, [user, forYouPosts]);

  console.log(posts);

  if (!user) {
    navigate("/auth");
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
        <Flex w={"full"}>
          <Flex
            onClick={() => setForYouPosts(true)}
            flex={1}
            borderBottom={forYouPosts && "1.5px solid white"}
            justifyContent={"center"}
            pb={3}
            cursor={"pointer"}
            color={true && "gray.light"}
          >
            <Text fontWeight={"bold"}>For you</Text>
          </Flex>
          <Flex
            onClick={() => setForYouPosts(false)}
            flex={1}
            borderBottom={!forYouPosts && "1.5px solid gray"}
            justifyContent={"center"}
            color={true && "gray.light"}
            pb={3}
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Following</Text>
          </Flex>
        </Flex>
        {posts &&
          posts.map((post) => (
            <UserPost key={post.id} post={post} setPosts={setPosts} />
          ))}
        {!posts.length && !user?.following && (
          <Flex justifyContent={"center"} mt={4}>
            <h1>Follow to see posts</h1>
          </Flex>
        )}
      </Box>
      <Box flex={30} display={{ base: "none", md: "block" }}>
        <Text mb={6} fontWeight={"bold"}>
          Suggestions for you
        </Text>
        <Flex
          direction={"column"}
          maxH={"300px"}
          overflowY={"auto"}
          pr={4}
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
              borderRadius: "8px",
              backgroundColor: `black`,
            },

            "&::-webkit-scrollbar-thumb": {
              bg: "gray.800",
              borderRadius: "1.4rem",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              bg: "#929292",
            },
          }}
        >
          <SuggestedUsers />
        </Flex>
      </Box>
    </Flex>
  );
};

export default HomePage;

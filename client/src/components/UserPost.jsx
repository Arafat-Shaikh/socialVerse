import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { DeleteIcon } from "@chakra-ui/icons";
import useHandleDeletePost from "../hooks/useHandleDeletePost";
import useFormatDate from "../hooks/useFormatDate";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const UserPost = ({ post }) => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const { handleDeletePost, loading, isDeleted } = useHandleDeletePost();
  const { formatDate } = useFormatDate();
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    async function getUserProfile() {
      try {
        console.log(post.postedBy);
        const res = await fetch("api/user/profile/" + post.postedBy);
        const data = await res.json();

        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data);
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (post) {
      getUserProfile();
    }
  }, [post, isDeleted, posts]);

  console.log(post);
  if (!post) {
    return <p>no post</p>;
  }

  return (
    <Link to={`/${user.username}/post/${post.id}`}>
      <Flex
        _hover={{ bg: "#010101" }}
        gap={3}
        py={5}
        borderTop={"1px"}
        borderColor={"gray.900"}
        borderRadius={"md"}
        p={8}
      >
        <Flex flexDirection={"column"} alignItems={"center"} minW={12}>
          <Avatar
            size={{ base: "sm", md: "md" }}
            name={user.username}
            src={user.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          {post.replies.length ? (
            <Box w={0.5} h={"full"} bg={"gray.light"} my={2}></Box>
          ) : null}
          <Box position={"relative"} w={"full"}>
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
                name={post.replies[0].username}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                name={post.replies[1].username}
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size={"xs"}
                name={post.replies[2].username}
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"}>
            <Flex alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={"center"} gap={4}>
              <Text fontStyle={"sm"}>{formatDate(post.createdAt)}</Text>
              {loggedInUser.id === post.postedBy && (
                <DeleteIcon
                  onClick={(e) => handleDeletePost(e, post.id)}
                  boxSize={3}
                />
              )}
            </Flex>
          </Flex>
          <Text>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>

          <Flex alignItems={"center"} gap={2}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {post.replies.length} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {post.likes && post.likes.length} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;

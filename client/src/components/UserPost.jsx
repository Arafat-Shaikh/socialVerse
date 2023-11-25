import { Avatar, Box, Flex, Image, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import useHandleDeletePost from "../hooks/useHandleDeletePost";

const UserPost = ({ post, setPosts }) => {
  const [isLiked, setLiked] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, handleDeletePost, isDeleted } = useHandleDeletePost();
  let formattedDate = formatDistanceToNow(new Date(post.createdAt))
    .split(" ")
    .filter((word) => word !== "about");

  formattedDate = formattedDate[0] + formattedDate[1][0];

  console.log(formattedDate);

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
  }, [post]);

  console.log(post);
  if (!post) {
    return <p>no post</p>;
  }

  return (
    <Link to={`/${user.username}/post/${post.id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={user.username}
            src={user.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w={0.5} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                name="john doe"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                name="john doe"
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
                name="john doe"
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
              <Text fontStyle={"sm"}>{formattedDate}</Text>
              <DeleteIcon onClick={() => handleDeletePost(post.id)} />
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
            <Actions post={post} setPosts={setPosts} />
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

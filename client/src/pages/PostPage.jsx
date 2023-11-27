import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useFormatDate from "../hooks/useFormatDate";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import useHandleDeletePost from "../hooks/useHandleDeletePost";
import userAtom from "../atoms/userAtom";

const PostPage = () => {
  const { pid, username } = useParams();
  const { user, loading } = useGetUserProfile();
  const toast = useToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [post, setPost] = useState("");
  const { formatDate } = useFormatDate();
  const [postLoading, setPostLoading] = useState(true);
  const { handleDeletePost, isDeleted } = useHandleDeletePost();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);

  useEffect(() => {
    async function getSinglePost() {
      setPostLoading(true);
      try {
        const response = await fetch("/api/post/get/" + pid);
        const data = await response.json();

        if (data.error) {
          toast({
            status: "error",
            description: data.error,
            isClosable: true,
          });
        } else {
          console.log(data);
          setPost(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPostLoading(false);
      }
    }
    getSinglePost();
  }, [pid, posts]);

  if (loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}></Spinner>
      </Flex>
    );
  }

  if (isDeleted) {
    navigate(`/${username}`);
  }

  return (
    <>
      <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
        <Flex alignItems={"center"} gap={3}>
          <Avatar
            src={user && user.profilePic}
            size={"md"}
            name={user && user.name}
          />
          <Flex alignItems={"center"}>
            <Text>{user && user.name}</Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Text fontSize={"xs"} color={"gray.light"}>
            {post && formatDate(post.createdAt)}
          </Text>
          {post && loggedInUser.id === post.postedBy && (
            <DeleteIcon
              ml={4}
              boxSize={3}
              cursor={"pointer"}
              onClick={(e) => handleDeletePost(e, post.id)}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{post && post.text}</Text>

      {post && post.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        {post && <Actions post={post} />}
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"sm"} color={"gray.light"}>
          {post && post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text fontSize={"sm"} color={"gray.light"}>
          {post && post.likes.length} likes
        </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text>👋</Text>
          <Text>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />
      {post && post.replies ? (
        post.replies.map((rep, idx) => {
          return (
            <>
              <Comment rep={rep} key={idx} postLoading={postLoading} />
              {post.replies.length - 1 !== idx && <Divider my={4} />}
            </>
          );
        })
      ) : (
        <Flex justifyContent={"center"} mt={10}>
          <Spinner size={"xl"} />
        </Flex>
      )}
    </>
  );
};

export default PostPage;

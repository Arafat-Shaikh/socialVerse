import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import useToastHook from "../hooks/useToastHook";

const Actions = ({ post }) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);
  const [isLiked, setIsLiked] = useState(post.likes.includes(loggedInUser.id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [liking, setLiking] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastHook();
  const [user, setUser] = useRecoilState(userAtom);

  const handleLikeAndUnlike = async () => {
    if (liking) return null;

    setLiking(true);

    try {
      const response = await fetch(`/api/post/like/${post.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        showToast("error", data.error, true);
      } else {
        console.log(data);

        if (!isLiked) {
          const updatedPost = posts.map((p) => {
            if (p.id === post.id) {
              return { ...p, likes: [...p.likes, loggedInUser.id] };
            }
            return p;
          });
          setPosts(updatedPost);
        } else {
          const updatedPosts = posts.map((p) => {
            if (post.id === p.id) {
              return {
                ...p,
                likes: p.likes.filter((id) => id !== loggedInUser.id),
              };
            }
            return p;
          });
          setPosts(updatedPosts);
        }
        setIsLiked(!isLiked);

        console.log(posts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLiking(false);
    }
  };

  const handleReplyToPost = async () => {
    if (loading) return;

    if (!reply) return;

    setLoading(true);

    try {
      const response = await fetch("/api/post/reply/" + post.id, {
        method: "PUT",
        body: JSON.stringify({ text: reply }),
        headers: { "content-type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        showToast("error", data.error, true);
      } else {
        console.log(data);
        const updatedPosts = posts.map((p) => {
          if (p.id === post.id) {
            return data;
          } else {
            return p;
          }
        });
        console.log(updatedPosts);
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Flex
        gap={3}
        my={2}
        onClick={(e) => e.preventDefault()}
        cursor={"pointer"}
      >
        <svg
          aria-label="Like"
          color={isLiked ? "rgb(237,73,86)" : ""}
          fill={isLiked ? "rgb(237,73,86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={() => handleLikeAndUnlike()}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>
        <svg
          aria-label="Comment"
          color={""}
          fill={""}
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"gray.dark"}>
          <ModalHeader>
            <Avatar src={user.profilePic} size={"md"} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <Textarea
                placeholder="Reply to post"
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={handleReplyToPost}
              isLoading={loading}
              borderRadius={"3xl"}
              bg={"yellow.700"}
              _hover={{ bg: "yellow.800" }}
              size={"sm"}
              pb={"2px"}
            >
              reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Actions;

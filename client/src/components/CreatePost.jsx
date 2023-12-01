import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import useHandleImg from "../hooks/useHandleImg";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useLocation, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const fileRef = useRef(null);
  const { handleImgChange, imgPreview, setImgPreview } = useHandleImg();
  const CHAR_LIMIT = 400;
  const [charLeft, setCharLeft] = useState(CHAR_LIMIT);
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const location = useLocation();
  const [user, setUser] = useRecoilState(userAtom);

  console.log(location);

  function handlePostText(e) {
    const text = e.target.value;

    setCharLeft(CHAR_LIMIT - text.length);

    if (text.length < CHAR_LIMIT) {
      setPostText(text);
    } else {
      setCharLeft(0);
      const modText = text.slice(0, CHAR_LIMIT);
      setPostText(modText);
    }
  }

  async function handlePost() {
    if (loading) return;

    if (!postText) {
      toast({
        status: "error",
        description: "Text is empty",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    let postInfo;

    if (imgPreview) {
      postInfo = { postedBy: currentUser.id, img: imgPreview, text: postText };
    } else {
      postInfo = { postedBy: currentUser.id, text: postText };
    }

    try {
      const res = await fetch("api/post/create", {
        method: "POST",
        body: JSON.stringify(postInfo),
        headers: { "content-type": "application/json" },
      });

      const data = await res.json();

      if (data.error) {
        toast({
          status: "error",
          description: data.error,
          isClosable: true,
        });
      } else {
        let path = location.pathname.split("");
        delete path[0];

        if (path.join("") === currentUser.username) {
          setPosts([data, ...posts]);
        }
        setLoading(false);
        onClose();
        toast({
          status: "success",
          description: "Post created",
          isClosable: true,
        });
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setImgPreview("");
      setPostText("");
    }
  }

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("black", "white")}
        paddingRight={2}
        onClick={onOpen}
        color={"black"}
      ></Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"gray.dark"}>
          <ModalHeader>
            <Avatar src={user.profilePic} size={"sm"} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Textarea
                placeholder="What's happening?"
                value={postText}
                onChange={handlePostText}
                focusBorderColor="gray.700"
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={1}
                color={"gray.800"}
              >
                {charLeft}/{CHAR_LIMIT}
              </Text>
              <Input
                type="file"
                hidden
                onChange={handleImgChange}
                ref={fileRef}
              />
              <BsFillImageFill
                style={{ cursor: "pointer", marginLeft: "5px" }}
                size={16}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>
            {imgPreview && (
              <Flex position={"relative"} mt={5}>
                <Image src={imgPreview} alt="img" />
                <CloseButton
                  onClick={() => setImgPreview("")}
                  position={"absolute"}
                  bg={"gray.800"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={handlePost}
              isLoading={loading}
              borderRadius={"3xl"}
              bg={"yellow.600"}
              color={"white"}
              _hover={{
                bg: "yellow.700",
              }}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

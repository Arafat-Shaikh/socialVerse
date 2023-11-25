import { AddIcon } from "@chakra-ui/icons";
import {
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

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const fileRef = useRef(null);
  const { handleImgChange, imgPreview, setImgPreview } = useHandleImg();
  const CHAR_LIMIT = 400;
  const [charLeft, setCharLeft] = useState(CHAR_LIMIT);
  const [user, setUser] = useRecoilState(userAtom);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  console.log(user);

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

    setLoading(true);
    let postInfo;

    if (imgPreview) {
      postInfo = { postedBy: user.id, img: imgPreview, text: postText };
    } else {
      postInfo = { postedBy: user.id, text: postText };
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
        setPosts([data, ...posts]);
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
    }
  }

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        paddingRight={2}
        onClick={onOpen}
      ></Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Textarea
                placeholder="Post content goes here"
                value={postText}
                onChange={handlePostText}
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
              colorScheme="blue"
              mr={3}
              onClick={handlePost}
              isLoading={loading}
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

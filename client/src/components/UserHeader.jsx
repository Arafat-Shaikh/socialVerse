import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useParams } from "react-router-dom";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const toastIdRef = useRef();
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);
  const [follow, setFollow] = useState(
    loggedInUser.following.includes(user.id)
  );

  function copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toastIdRef.current = toast({ description: "Copied" });
  }

  async function followUser() {
    try {
      console.log(user.id);
      const res = await fetch("api/user/follow/" + user.id, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        toast({
          status: "error",
          description: "can't follow",
          isClosable: true,
        });
      }

      console.log(follow);
      if (follow) {
        const index = loggedInUser.following.indexOf(user.id);
        loggedInUser.following.splice(index, 1);

        const index1 = user.followers.indexOf(loggedInUser._id);
        user.followers.splice(index1, 1);

        console.log(loggedInUser.following);
        console.log(user);
      }
      // else {
      //   loggedInUser.following.push(user.id);
      //   user.followers.push(loggedInUser._id);
      //   console.log(loggedInUser);
      //   console.log(user);
      // }

      toast({
        status: "success",
        description: data.message,
        isClosable: true,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(user);

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              social.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name="Mark"
            src={
              user.profilePic ? user.profilePic : "https://bit.ly/broken-link"
            }
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {loggedInUser?.id === user?.id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update</Button>
        </Link>
      )}

      {loggedInUser?.id !== user?.id && (
        <Button onClick={() => followUser()}>
          {loggedInUser.following.includes(user.id) ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex gap={2} alignItems={"center"}>
          <Text>3.2k followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link>instagram.com</Link>
        </Flex>
        <Flex gap={4}>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;

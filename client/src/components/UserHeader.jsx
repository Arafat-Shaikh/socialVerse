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
import useFollowUser from "../hooks/useFollowUser";
import useFormatDate from "../hooks/useFormatDate";
const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const UserHeader = ({ user, handleChangePosts, isReplyPosts }) => {
  const toast = useToast();
  const toastIdRef = useRef();
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);
  let joinDate = user.createdAt.split("-");
  [joinDate[0], joinDate[1]] = [joinDate[1], joinDate[0]];
  joinDate.pop();
  console.log(joinDate);
  // const [follow, setFollow] = useState(
  //   user?.followers && user.followers.includes(loggedInUser.id)
  // );
  // const [loading, setLoading] = useState(false);
  const { followUser, follow, loading } = useFollowUser();

  console.log(loggedInUser);

  function copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toastIdRef.current = toast({ description: "Copied" });
  }

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
            name={user.username}
            src={user.profilePic && user.profilePic}
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text fontSize={"sm"}>{user.bio}</Text>

      {loggedInUser?.id === user?.id && (
        <Link as={RouterLink} to="/update">
          <Button
            size={"sm"}
            borderRadius={"3xl"}
            borderColor={"gray.500"}
            borderWidth={"1px"}
          >
            Edit profile
          </Button>
        </Link>
      )}

      <Text fontSize={"sm"} color={"gray.500"} mb={"-14px"} mt={2}>
        {"Joined " + months[joinDate[0]] + " " + joinDate[1]}
      </Text>

      {loggedInUser?.id !== user?.id && (
        <Button
          onClick={() => followUser(user)}
          isLoading={loading}
          size={"sm"}
        >
          {follow ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.300"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.300"}> {user.following.length} following</Link>
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
          onClick={() => handleChangePosts(false)}
          flex={1}
          borderBottom={!isReplyPosts && "1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          color={isReplyPosts && "gray.light"}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
        <Flex
          onClick={() => handleChangePosts(true)}
          flex={1}
          borderBottom={isReplyPosts && "1.5px solid gray"}
          justifyContent={"center"}
          color={!isReplyPosts && "gray.light"}
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

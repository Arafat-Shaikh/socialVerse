import { Avatar, Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const Comment = ({ rep }) => {
  return (
    <Flex gap={4} py={2} my={2} w={"full"}>
      <Avatar
        src={rep.userProfilePic && rep.userProfilePic}
        size={"sm"}
        name={rep.username}
      />
      <Flex gap={1} w={"full"} flexDirection={"column"}>
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
          <Text fontWeight={"bold"} fontSize={"sm"}>
            {rep.username}
          </Text>
        </Flex>
        <Text fontSize={"sm"}>{rep.text}</Text>
      </Flex>
    </Flex>
  );
};

export default Comment;

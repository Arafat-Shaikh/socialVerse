import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";

const Comment = () => {
  return (
    <Flex gap={4} py={2} my={2} w={"full"}>
      <Avatar src="/zuck-avatar.png" size={"sm"} />
      <Flex gap={1} w={"full"} flexDirection={"column"}>
        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
          <Text fontWeight={"bold"} fontSize={"sm"}>
            Mark Zuck
          </Text>
        </Flex>
        <Text fontSize={"sm"}>this is very good.</Text>
      </Flex>
    </Flex>
  );
};

export default Comment;

import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const SuggestedUser = ({ u }) => {
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} gap={2} mb={2}>
      <Flex as={Link} to={`/${u.username}`} gap={2}>
        <Avatar src="" name={u.name} size={"md"} />
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {u.name}
          </Text>
          <Text fontSize={"sm"} color={"gray.light"}>
            {u.username}
          </Text>
        </Box>
      </Flex>
      <Button
        size={"sm"}
        color={true ? "black" : "white"}
        bg={true ? "white" : "blue.400"}
        _hover={({ color: true ? "black" : "white" }, { opacity: 0.8 })}
      >
        follow
      </Button>
    </Flex>
  );
};

export default SuggestedUser;

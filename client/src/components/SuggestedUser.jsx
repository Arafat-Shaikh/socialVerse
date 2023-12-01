import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUser from "../hooks/useFollowUser";

const SuggestedUser = ({ u }) => {
  const currentUser = useRecoilState(userAtom);
  const { followUser, follow, loading } = useFollowUser();
  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} gap={2} mb={3}>
      <Flex as={Link} to={`/${u.username}`} gap={2}>
        <Avatar src={u.profilePic && u.profilePic} size={"md"} />
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
        size={"xs"}
        color={follow ? "white" : "black"}
        bg={follow ? "gray.dark" : "white"}
        _hover={({ color: true ? "black" : "white" }, { opacity: 0.8 })}
        isLoading={loading}
        onClick={() => followUser(u)}
      >
        {follow ? "Unfollow" : "follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;

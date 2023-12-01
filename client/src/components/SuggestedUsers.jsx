import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import { Box, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    setLoading(true);
    async function getSuggestedUsers() {
      try {
        const response = await fetch(`/api/user/users`);
        const data = await response.json();

        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data);
          setSuggestedUsers(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getSuggestedUsers();
  }, [user]);
  return (
    <>
      {!loading &&
        suggestedUsers.map((u) => <SuggestedUser u={u} key={u.id} />)}
      {loading &&
        Array.from({ length: 5 }).map((_, idx) => (
          <Flex
            key={idx}
            gap={2}
            p={1}
            alignItems={"center"}
            borderRadius={"md"}
          >
            <Box>
              <SkeletonCircle size={10}></SkeletonCircle>
            </Box>
            <Flex flexDirection={"column"} gap={2} w={"full"}>
              <Skeleton w={"80px"} h={"8px"}></Skeleton>
              <Skeleton w={"90px"} h={"8px"}></Skeleton>
            </Flex>
            <Flex>
              <Skeleton h={"20px"} w={"40px"} />
            </Flex>
          </Flex>
        ))}
    </>
  );
};

export default SuggestedUsers;

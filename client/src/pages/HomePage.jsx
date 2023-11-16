import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import Logout from "../components/Logout";

const HomePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  return (
    <Link to={"/hey"} replace={true}>
      <Flex justifyContent={"center"}>
        <Button>see posts</Button>
      </Flex>
      {user && <Logout />}
    </Link>
  );
};

export default HomePage;

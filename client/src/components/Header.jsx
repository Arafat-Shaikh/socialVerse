import { Flex, Icon, Image, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import Logout from "./Logout";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [user, setUser] = useRecoilState(userAtom);
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link to="/" replace={true}>
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Link to={"/" + user.username} replace={true}>
          <RxAvatar size={24} />
        </Link>
      )}
      {user && <Logout />}
    </Flex>
  );
};

export default Header;

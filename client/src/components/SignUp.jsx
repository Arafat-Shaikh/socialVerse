import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authState from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import useToastHook from "../hooks/useToastHook";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthState = useSetRecoilState(authState);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastHook();

  const handleSignUp = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        body: JSON.stringify(inputs),
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);

        showToast("error", data.error, true);
      } else {
        console.log(data);
        localStorage.setItem("user-d", JSON.stringify(data));
        setUser(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "rgb(1,1,1)")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Full name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setInputs({ ...inputs, name: e.target.value })
                      }
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) =>
                        setInputs({ ...inputs, username: e.target.value })
                      }
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setInputs({ ...inputs, password: e.target.value })
                    }
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={"rgb(84, 85, 87)"}
                  color={"white"}
                  _hover={{
                    bg: "rgb(73, 71, 72)",
                  }}
                  onClick={handleSignUp}
                  isLoading={loading}
                  borderRadius={"3xl"}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => setAuthState("login")}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

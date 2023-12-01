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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authState from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthState = useSetRecoilState(authState);
  const [inputs, setInput] = useState({
    email: "",
    password: "",
  });

  const toast = useToast();
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!inputs.email || !inputs.password) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        body: JSON.stringify(inputs),
        headers: { "content-type": "application/json" },
      });

      const data = await res.json();
      if (data.error) {
        toast({
          title: `${data.error}`,
          status: "error",
          isClosable: true,
        });
      } else {
        console.log(data);
        localStorage.setItem("user-d", JSON.stringify(data));
        setUser(data);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "rgb(1, 1, 1)")}
          boxShadow={"lg"}
          p={8}
          w={{ base: "full", sm: "400px" }}
        >
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) => setInput({ ...inputs, email: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInput({ ...inputs, password: e.target.value })
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
                onClick={handleLogin}
                isLoading={loading}
                borderRadius={"3xl"}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Link color={"blue.400"} onClick={() => setAuthState("signup")}>
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

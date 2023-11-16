import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  useToast,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

export default function UpdateUserPage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [imgPreview, setImgPreview] = useState("");
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
    password: "",
  });

  const fileRef = useRef(null);
  const toast = useToast();

  function handleImgChange(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      alert("File size exceeds");
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await fetch("api/user/update", {
        method: "PATCH",
        body: JSON.stringify({ ...inputs, profilePic: imgPreview }),
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        toast({
          title: `${data.error}`,
          status: "error",
          isClosable: true,
        });
      } else {
        localStorage.setItem("user-d", JSON.stringify(data));
        setUser(data);
        console.log(data);
        toast({
          title: `${"Profile updated successfully"}`,
          status: "success",
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={imgPreview || user.profilePic}>
                <AvatarBadge size="sm" rounded="full" colorScheme="red" />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>
                Change Icon
              </Button>
              <Input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleImgChange}
              />
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="fullName" isRequired>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="Full name"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
          />
        </FormControl>
        <FormControl id="username" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="Username"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
          />
        </FormControl>{" "}
        <FormControl id="bio">
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Bio"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={inputs.bio}
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
          />
        </FormControl>{" "}
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="password"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"gray.600"}
            color={"white"}
            w="full"
            _hover={{
              bg: "gray.700",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"yellow.600"}
            color={"white"}
            w="full"
            _hover={{
              bg: "yellow.700",
            }}
            onClick={handleUpdate}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

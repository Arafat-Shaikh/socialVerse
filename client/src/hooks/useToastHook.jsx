import { useToast } from "@chakra-ui/react";

const useToastHook = () => {
  const toast = useToast();

  function showToast(status, description, isClosable) {
    toast({
      status: status,
      description: description,
      isClosable: isClosable,
    });
  }

  return { showToast };
};

export default useToastHook;

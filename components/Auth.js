import { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  FormControl,
  Box,
  FormLabel,
  Button,
  useToast,
  Input,
  Spacer,
  HStack,
} from "@chakra-ui/react";
export default function Auth(props) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (type, email, password) => {
    try {
      const { error, user } =
        type === "LOGIN"
          ? await supabase.auth.signIn({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (error)
        toast({
          title: "An error occurred.",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      if (user && type === "SIGNUP") {
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        props.onClose();
      }
      if (user && type === "LOGIN") {
        toast({
          title: "Login Successful.",
          description: "You have logged in successfully",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        props.onClose();
      }
    } catch (error) {
      console.log("Error thrown:", error.message);
      alert(error.error_description || error);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <Box maxW="md" overflow="hidden">
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <HStack paddingTop="20px">
        <Spacer></Spacer>
        <Button
          colorScheme="blue"
          onClick={(e) => {
            e.preventDefault();
            handleLogin("SIGNUP", email, password);
          }}
        >
          Sign Up
        </Button>
        <Button
          colorScheme="blue"
          onClick={(e) => {
            e.preventDefault();
            handleLogin("LOGIN", email, password);
          }}
        >
          Login
        </Button>
      </HStack>
    </Box>
  );
}

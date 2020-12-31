import { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  FormControl,
  Box,
  FormLabel,
  Button,
  FormHelperText,
  Input,
  Spacer,
} from "@chakra-ui/react";
export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (type, email, password) => {
    try {
      const { error, user } =
        type === "LOGIN"
          ? await supabase.auth.signIn({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (!error && !user) alert("Check your email for the login link!");
      if (error) console.log("Error returned:", error.message);
    } catch (error) {
      console.log("Error thrown:", error.message);
      alert(error.error_description || error);
    }
  };
  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      padding="10px"
    >
      <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
        Please Login
      </Box>
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
      <Button
        colorScheme="blue"
        onClick={(e) => {
          e.preventDefault();
          handleLogin("LOGIN", email, password);
        }}
      >
        Login
      </Button>
    </Box>
  );
}

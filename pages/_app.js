import { ChakraProvider, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Flex, Heading, Box, Spacer, Button, Text } from "@chakra-ui/react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import styles from "../styles/Home.module.css";

function MyApp({ Component, pageProps }) {
  let [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  return (
    <ChakraProvider>
      <Head>
        <title>90 Number Bingo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex bg="gray.100" padding="10px">
        <Box p="2">
          <Heading size="md">Bingo (90 Number)</Heading>
        </Box>
        <HStack>
          <Link href="/">
            <Button colorScheme="blue">Home</Button>
          </Link>
          {session && (
            <Link href="/play">
              <Button colorScheme="blue">Play</Button>
            </Link>
          )}
        </HStack>
        <Spacer />
        {!session && (
          <HStack>
            <Button colorScheme="blue">Log in</Button>
            <Button colorScheme="blue">Sign Up</Button>
          </HStack>
        )}
        {session && (
          <HStack>
            <Text>
              <Text>{session.user.email}</Text>
            </Text>
            <Button colorScheme="blue">Sign Out</Button>
          </HStack>
        )}
      </Flex>
      <Component {...pageProps} />
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </ChakraProvider>
  );
}

export default MyApp;

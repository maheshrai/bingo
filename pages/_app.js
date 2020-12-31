import { ChakraProvider, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Flex,
  Heading,
  Box,
  Spacer,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { supabase } from "../lib/supabase";
import Auth from "../components/Auth";
import styles from "../styles/Home.module.css";

function MyApp({ Component, pageProps }) {
  let [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <Button colorScheme="blue" onClick={onOpen}>
              Login
            </Button>
          </HStack>
        )}
        {session && (
          <HStack>
            <Text>
              <Text>{session.user.email}</Text>
            </Text>
            <Button
              colorScheme="blue"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) console.log("Error logging out:", error.message);
              }}
            >
              Sign Out
            </Button>
          </HStack>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Login or Sign Up</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Auth onClose={onClose}></Auth>
          </ModalBody>
        </ModalContent>
      </Modal>
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

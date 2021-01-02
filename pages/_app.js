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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Text,
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
          <Heading size="md">Bingo</Heading>
        </Box>
        <HStack>
          <Link href="/">Home</Link>
          {session && <Link href="/groups">Groups</Link>}
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
          <Menu>
            <MenuButton as={Button} colorScheme="teal">
              Profile
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <MenuItem>{session.user.email}</MenuItem>
                <MenuItem
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (error) console.log("Error logging out:", error.message);
                  }}
                >
                  Sign Out
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
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

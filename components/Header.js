import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import UserContext from "../lib/UserContext";
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
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  useDisclosure,
} from "@chakra-ui/react";
import Auth from "./Auth";
export function Header() {
  const { user, signOut } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
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
          {user && <Link href="/groups">Play</Link>}
        </HStack>
        <Spacer />
        {!user && (
          <HStack>
            <Button colorScheme="teal" onClick={onOpen}>
              Login
            </Button>
          </HStack>
        )}
        {user && (
          <Menu>
            <MenuButton as={Button} colorScheme="teal">
              Profile
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <MenuItem>{user.email}</MenuItem>
                <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
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
    </Box>
  );
}

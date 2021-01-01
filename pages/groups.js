import {
  Wrap,
  WrapItem,
  Avatar,
  Box,
  Heading,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
  Divider,
  Tooltip,
  IconButton,
  AddIcon,
} from "@chakra-ui/react";
import Link from "next/link";

function Groups() {
  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Box padding="10px">
        <HStack>
          <Heading as="h3" size="lg">
            Bingo Groups
          </Heading>
          <Button colorScheme="teal">Add</Button>
        </HStack>
      </Box>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <VStack>
          <Heading as="h3" size="lg">
            Family
          </Heading>
        </VStack>
        <Divider></Divider>
        <HStack padding="10px">
          <Text>Members</Text>
        </HStack>
        <Wrap>
          <WrapItem>
            <Box p="6">
              <Wrap>
                <WrapItem>
                  <Tooltip label="Jimmie Hayes" fontSize="md">
                    <Avatar name="Jimmie Hayes" />
                  </Tooltip>
                </WrapItem>
                <WrapItem>
                  <Tooltip label="Sheila Vaughn" fontSize="md">
                    <Avatar name="Sheila Vaughn" />
                  </Tooltip>
                </WrapItem>
                <WrapItem>
                  <Tooltip label="James Hines" fontSize="md">
                    <Avatar name="James Hines" />
                  </Tooltip>
                </WrapItem>
                <WrapItem>
                  <Tooltip label="Holly Stanley" fontSize="md">
                    <Avatar name="Holly Stanley" />
                  </Tooltip>
                </WrapItem>
              </Wrap>
            </Box>
          </WrapItem>
        </Wrap>
        <HStack>
          <Spacer></Spacer>
          <Button colorScheme="teal">Edit</Button>
          <Button colorScheme="red">Delete</Button>
          <Link href="/bingo/1">
            <Button colorScheme="teal">Play</Button>
          </Link>
        </HStack>
      </Box>
    </Box>
  );
}

export default Groups;

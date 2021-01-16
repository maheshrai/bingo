import Head from "next/head";
import Link from "next/link";
import {
  Flex,
  Heading,
  Box,
  Spacer,
  Button,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
        <Heading fontSize="xl">Bingo Card</Heading>
        <Text mt={4}>
          90 number bingo card has 3 lines and 9 columns of numbers. Each line
          has 5 numbers and four empty slots. The columns are arranged as below:
        </Text>
        <UnorderedList>
          <ListItem>01-09 in the 1st Column</ListItem>
          <ListItem>10-19 in the 2nd Column</ListItem>
          <ListItem>20-29 in the 3rd Column</ListItem>
          <ListItem>30-39 in the 4th Column</ListItem>
          <ListItem>40-49 in the 5th Column</ListItem>
          <ListItem>50-59 in the 6th Column</ListItem>
          <ListItem>60-69 in the 7th Column</ListItem>
          <ListItem>70-79 in the 8th Column</ListItem>
          <ListItem>80-90 in the 9th Column</ListItem>
        </UnorderedList>
      </Box>
      <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
        <Heading fontSize="xl">How to Play</Heading>
        <UnorderedList>
          <ListItem>Create a group and add players to the group.</ListItem>
          <ListItem>Identify one player as the caller.</ListItem>
          <ListItem>
            Each player will pick a Bingo card. Once the game starts, you cannot
            change your bingo card.
          </ListItem>
          <ListItem>
            The caller will call the nunmbers 1-90 in random order.
          </ListItem>
          <ListItem>
            If your number is called, mark it on the bingo card.
          </ListItem>
        </UnorderedList>
      </Box>
      <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
        <Heading fontSize="xl">How to Win</Heading>
        <UnorderedList>
          <ListItem>
            First Five - First 5 numbers on the card are marked
          </ListItem>
          <ListItem>
            One Line - All the 5 numbers on a line are marked (You can also have
            first, middle and last line winners)
          </ListItem>
          <ListItem>
            Two Lines - All the 10 numbers on two lines are marked
          </ListItem>
          <ListItem>
            Full House - All the 15 numbers on the card are marked
          </ListItem>
        </UnorderedList>
      </Box>
    </div>
  );
}

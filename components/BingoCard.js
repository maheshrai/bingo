import { DeleteIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  SimpleGrid,
  Box,
  Button,
  Spacer,
  Text,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { BingoSquare } from "./BingoSquare";

export function BingoCard(props) {
  return (
    <Box maxW="lg" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <SimpleGrid columns={9} spacing={1}>
        {props.player.card.squares.map((i) => (
          <BingoSquare
            key={i.key}
            square={i}
            player={props.player}
            updateSquare={props.updateSquare}
          ></BingoSquare>
        ))}
      </SimpleGrid>
      <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
        <HStack padding="3px">
          <Text>{props.player.name}</Text>
          <Spacer></Spacer>
          <IconButton
            aria-label="Assign me a new card!"
            disabled={!props.allowCardUpdate}
            onClick={() => props.assignNewCard(props.player)}
            icon={<RepeatIcon />}
          />
        </HStack>
      </Box>
    </Box>
  );
}

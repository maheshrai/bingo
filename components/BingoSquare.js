import { Center, Box } from "@chakra-ui/react";
export function BingoSquare(props) {
  return (
    <Center
      w="35px"
      h="35px"
      bg={!props.square.checked ? "tomato" : "green.200"}
      onClick={
        props.square.number > 0
          ? () =>
              props.updateSquare(
                props.player,
                props.square,
                !props.square.checked
              )
          : undefined
      }
      color="black.500"
    >
      {props.square.number > 0 && (
        <Box as="span" fontWeight="bold" fontSize="lg">
          {props.square.number}
        </Box>
      )}
    </Center>
  );
}

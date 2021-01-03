import { SimpleGrid } from "@chakra-ui/react";
import { BingoSquare } from "./BingoSquare";

export function BingoCard(props) {
  return (
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
  );
}

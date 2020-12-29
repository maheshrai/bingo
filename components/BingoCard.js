import { SimpleGrid } from '@chakra-ui/react';
import { BingoSquare } from './BingoSquare';

export function BingoCard(props) {
  return (
    <SimpleGrid columns={9} spacing={1}>
      {props.card.squares.map(i => (
        <BingoSquare
          key={i.key}
          square={i}
          name={props.name}
          updateSquare={props.updateSquare}
        ></BingoSquare>
      ))}
    </SimpleGrid>
  );
}

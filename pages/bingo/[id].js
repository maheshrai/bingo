import { Wrap, WrapItem, Box, Divider } from "@chakra-ui/react";
import { useState } from "react";
import { BingoCard } from "../../components/BingoCard";
import { createBingoCard } from "../../components/CardGenerator";
import { CardModel, Game, Player, SquareModel } from "../../components/Model";
import { Caller } from "../../components/Caller";

function Bingo() {
  var card1 = createBingoCard();
  var cm1 = new CardModel();
  card1.forEach((n, i) => {
    var sm = new SquareModel();
    sm.number = n;
    sm.key = "card1-" + i;
    cm1.squares.push(sm);
  });

  var card2 = createBingoCard();
  var cm2 = new CardModel();
  card2.forEach((n, i) => {
    var sm = new SquareModel();
    sm.number = n;
    sm.key = "card2-" + i;
    cm2.squares.push(sm);
  });

  var card3 = createBingoCard();
  var cm3 = new CardModel();
  card3.forEach((n, i) => {
    var sm = new SquareModel();
    sm.number = n;
    sm.key = "card3-" + i;
    cm3.squares.push(sm);
  });

  var player1 = new Player();
  player1.name = "Player 1";
  player1.card = cm1;

  var player2 = new Player();
  player2.name = "Player 2";
  player2.card = cm2;

  var gm = new Game();
  gm.players = [player1, player2];

  const [game, setGame] = useState(gm);
  let [session, setSession] = useState(null);
  function updateSquare(name, sq, checked) {
    setGame((gm) => {
      const p = gm.players.find((p) => p.name === name);
      if (p) {
        var cm = new CardModel();
        cm.squares = p.card.squares.map((i) =>
          i.number === sq.number ? { ...i, checked: checked } : i
        );
        var gm2 = { ...gm };
        const p2 = gm2.players.find((p) => p.name === name);
        p2.card = cm;
        return gm2;
      }
    });
  }

  async function updateNumbersCalled(nums) {
    // TBD
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Wrap>
        {game.players.map((i) => (
          <WrapItem>
            <Box
              maxW="lg"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <BingoCard
                card={i.card}
                name={i.name}
                updateSquare={updateSquare}
              />
              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated
              >
                {i.name}
              </Box>
            </Box>
          </WrapItem>
        ))}
      </Wrap>
      <Caller updateNumbersCalled={updateNumbersCalled}></Caller>
    </Box>
  );
}

export default Bingo;

import { Wrap, WrapItem, Box, Heading, useToast } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { BingoCard } from "../../../components/BingoCard";
import {
  CardModel,
  Game,
  Player,
  SquareModel,
} from "../../../components/Model";
import { Caller } from "../../../components/Caller";
import { supabase } from "../../../lib/supabase";
import UserContext from "../../../lib/UserContext";

function Play() {
  const toast = useToast();
  const [game, setGame] = useState(null);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { groupid, gameid } = router.query;
  const [updatedGame, handleUpdatedGame] = useState(null);
  const [updatedPlayer, handleUpdatedPlayer] = useState(null);

  useEffect(() => {
    fetchGame();
    const myGameSubscription = supabase
      .from("game:id=eq." + gameid)
      .on("UPDATE", (payload) => handleUpdatedGame(payload.new))
      .subscribe();
    const myPlayerSubscription = supabase
      .from("player:game=eq." + gameid)
      .on("UPDATE", (payload) => handleUpdatedPlayer(payload.new))
      .subscribe();
    return () => {
      myGameSubscription.unsubscribe();
      myPlayerSubscription.unsubscribe();
    };
  }, []);

  // Update to game recieved from Postgres
  useEffect(() => {
    if (updatedGame) {
      console.log("Game Update >>> " + JSON.stringify(updatedGame));
      setGame((gm) => {
        var gm2 = { ...gm };
        gm2.calledNumbers = updatedGame.calledNumbers;
        return gm2;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedGame]);

  // Update to game recieved from Postgres
  useEffect(() => {
    if (updatedPlayer) {
      console.log("Player Update >>> " + JSON.stringify(updatedPlayer));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedPlayer]);

  async function fetchGame() {
    if (!gameid) return;
    let { data, error } = await supabase
      .from("game")
      .select(`*,player(id,name,email,card),group(id,name)`)
      .eq("id", gameid);
    console.log(JSON.stringify(data));
    var gametemp = new Game();
    if (error) {
      console.log("Error logging out:", error.message);
      toast({
        title: "Failed to load game",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      gametemp.players = [];
      gametemp.calledNumbers = data[0].calledNumbers;
      data[0].player.forEach((player) => {
        var p = new Player();
        p.name = player.name;
        p.email = player.email;
        let card = player.card;
        p.card = new CardModel();
        card.forEach((n, i) => {
          var sm = new SquareModel();
          sm.number = n;
          sm.key = data[0].id + "-" + player.id + "-" + i;
          p.card.squares.push(sm);
        });
        gametemp.players.push(p);
      });
      gametemp.group = data[0].group;
      gametemp.caller = data[0].caller;
      setGame(gametemp);
    }
  }

  function updateSquare(player, sq, checked) {
    if (player.email !== user.email) return;
    setGame((gm) => {
      const p = gm.players.find((p) => p.email === player.email);
      if (p) {
        var cm = new CardModel();
        cm.squares = p.card.squares.map((i) =>
          i.number === sq.number ? { ...i, checked: checked } : i
        );
        var gm2 = { ...gm };
        const p2 = gm2.players.find((p) => p.email === player.email);
        p2.card = cm;
        return gm2;
      }
    });
  }

  async function updateCalledNumbers(nums) {
    let { data, error } = await supabase
      .from("game")
      .update({ calledNumbers: nums })
      .eq("id", gameid);
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Heading paddingBottom="20px">
        {game && game.group && "Play bingo with " + game.group.name + "!"}
      </Heading>
      <Heading as="h4" size="md" paddingBottom="20px">
        Player cards
      </Heading>
      <Wrap spacing="30px">
        {user &&
          game &&
          game.players &&
          game.players
            .filter(
              (p) =>
                game.completed ||
                game.caller === user.email ||
                p.email === user.email
            )
            .map((i) => (
              <WrapItem key={i.email}>
                <Box
                  maxW="lg"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <BingoCard player={i} updateSquare={updateSquare} />
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
      <Box paddingTop="30px">
        <Caller
          updateCalledNumbers={updateCalledNumbers}
          calledNumbers={game && game.calledNumbers ? game.calledNumbers : []}
          isCaller={user && game && game.caller === user.email}
        ></Caller>
      </Box>
    </Box>
  );
}

export default Play;

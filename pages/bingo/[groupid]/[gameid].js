import {
  Wrap,
  WrapItem,
  Box,
  Heading,
  useToast,
  Text,
  Button,
} from "@chakra-ui/react";
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
import { createBingoCard } from "../../../components/CardGenerator";
import { supabase } from "../../../lib/supabase";
import UserContext from "../../../lib/UserContext";
import { CheckCircleIcon } from "@chakra-ui/icons";

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
        gm2.started = updatedGame.started;
        gm2.completed = updatedGame.completed;
        return gm2;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedGame]);

  // Update to player recieved from Postgres
  useEffect(() => {
    if (updatedPlayer) {
      console.log("Player Update >>> " + JSON.stringify(updatedPlayer));
      let cm = new CardModel();
      updatedPlayer.card.forEach((n, i) => {
        var sm = new SquareModel();
        sm.number = n;
        sm.key = gameid + "-" + updatedPlayer.id + "-" + i;
        sm.checked = updatedPlayer.checkedNumbers
          ? updatedPlayer.checkedNumbers.includes(n)
          : false;
        cm.squares.push(sm);
      });
      setGame((gm) => {
        const p = gm.players.find((p) => p.id === updatedPlayer.id);
        if (p) {
          var gm2 = { ...gm };
          const p2 = gm2.players.find((p) => p.id === updatedPlayer.id);
          p2.card = cm;
          return gm2;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedPlayer]);

  async function fetchGame() {
    if (!gameid) return;
    let { data, error } = await supabase
      .from("game")
      .select(`*,player(id,name,email,card,checkedNumbers),group(id,name)`)
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
      gametemp.started = data[0].started;
      gametemp.completed = data[0].completed;
      data[0].player.forEach((player) => {
        var p = new Player();
        p.name = player.name;
        p.email = player.email;
        p.id = player.id;
        let card = player.card;
        p.card = new CardModel();
        card.forEach((n, i) => {
          var sm = new SquareModel();
          sm.number = n;
          sm.checked = player.checkedNumbers
            ? player.checkedNumbers.includes(n)
            : false;
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

  async function assignNewCard(player) {
    let card = createBingoCard();
    const { data, error } = await supabase
      .from("player")
      .update({ card: card })
      .eq("id", player.id);
    if (error) {
    }
  }

  async function startGame() {
    const { data, error } = await supabase
      .from("game")
      .update({ started: true })
      .eq("id", gameid);
    if (error) {
    }
  }

  async function updateSquare(player, sq, checked) {
    if (player.email !== user.email) return;
    if (!game.calledNumbers.includes(sq.number)) {
      toast({
        description: "Number " + sq.number + " not called yet!",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    /*setGame((gm) => {
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
    });*/
    // update the database
    let checkedNumbers = player.card.squares.map((s) =>
      s.checked ? s.number : 0
    );
    checkedNumbers = checkedNumbers.filter((i) => i > 0);
    if (checked) checkedNumbers.push(sq.number);
    else checkedNumbers = checkedNumbers.filter((i) => i !== sq.number);
    let { data, error } = await supabase
      .from("player")
      .update({ checkedNumbers: checkedNumbers })
      .eq("id", player.id);
  }

  async function updateCalledNumbers(nums) {
    let { data, error } = await supabase
      .from("game")
      .update({ calledNumbers: nums })
      .eq("id", gameid);
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Heading paddingBottom="10px">
        {game && game.group && "Play bingo with " + game.group.name + "!"}
      </Heading>
      <Box paddingBottom="5px">
        {game && game.started && (
          <Text>
            {game && game.calledNumbers && game && game.calledNumbers.length > 0
              ? "Last number called was " +
                game.calledNumbers[game.calledNumbers.length - 1]
              : "No number called yet!"}
          </Text>
        )}
        {game && !game.started && game.caller === user.email && (
          <Button colorScheme="teal" onClick={() => startGame()}>
            Start Game!
          </Button>
        )}
      </Box>
      <Heading as="h4" size="md" paddingBottom="10px">
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
                <BingoCard
                  player={i}
                  allowCardUpdate={!game.started && i.email === user.email}
                  updateSquare={updateSquare}
                  assignNewCard={assignNewCard}
                />
              </WrapItem>
            ))}
      </Wrap>
      <Box paddingTop="30px">
        <Caller
          updateCalledNumbers={updateCalledNumbers}
          calledNumbers={game && game.calledNumbers ? game.calledNumbers : []}
          isCaller={user && game && game.caller === user.email}
          started={game && game.started}
        ></Caller>
      </Box>
    </Box>
  );
}

export default Play;

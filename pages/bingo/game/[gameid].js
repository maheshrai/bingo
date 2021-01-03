import { Wrap, WrapItem, Box, Divider, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BingoCard } from "../../../components/BingoCard";
import { createBingoCard } from "../../../components/CardGenerator";
import {
  CardModel,
  Game,
  Player,
  SquareModel,
} from "../../../components/Model";
import { Caller } from "../../../components/Caller";
import { supabase } from "../../../lib/supabase";

function Play() {
  const [game, setGame] = useState(null);
  const [caller, setCaller] = useState("");
  const [group, setGroup] = useState(null);
  let [session, setSession] = useState(null);
  const router = useRouter();
  const { gameid } = router.query;
  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    let { data, error } = await supabase
      .from("game")
      .select(`*,player(id,name,email,card),group(id,name)`)
      .eq("id", gameid);
    if (error) {
    } else {
      console.log(JSON.stringify(data));
      var game = new Game();
      game.players = [];
      setGroup(data[0].group);
      setCaller(data[0].caller);
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
        game.players.push(p);
      });
      setGame(game);
    }
  }

  function updateSquare(player, sq, checked) {
    if (player.email !== session.user.email) return;
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

  async function updateNumbersCalled(nums) {
    // TBD
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Heading paddingBottom="20px">
        {group && "Play bingo with " + group.name + "!"}
      </Heading>
      <Heading as="h4" size="md" paddingBottom="20px">
        Player cards
      </Heading>
      <Wrap spacing="30px">
        {game &&
          game.players.map((i) => (
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
          updateNumbersCalled={updateNumbersCalled}
          isCaller={session && session.user && caller === session.user.email}
        ></Caller>
      </Box>
    </Box>
  );
}

export default Play;

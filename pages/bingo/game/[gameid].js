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
  let [session, setSession] = useState(null);
  const [group, setGroup] = useState(null);
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
    let { data: group, error } = await supabase
      .from("group")
      .select(`id,name,owner,groupmember(id, name)`)
      .eq("id", gameid);
    setGroup(group[0]);
    var game = new Game();
    console.log(JSON.stringify(group));
    game.players = [];
    if (!error && group) {
      group[0].groupmember.forEach((gm) => {
        var p = new Player();
        p.name = gm.name;
        let card = createBingoCard();
        p.card = new CardModel();
        card.forEach((n, i) => {
          var sm = new SquareModel();
          sm.number = n;
          sm.key = gm.id + "-" + i;
          p.card.squares.push(sm);
        });
        game.players.push(p);
      });
    }
    setGame(game);
  }

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
      <Heading paddingBottom="20px">
        {group && "Bingo with " + group.name + "!"}
      </Heading>
      <Heading as="h4" size="md" paddingBottom="20px">
        Player cards
      </Heading>
      <Wrap>
        {game &&
          game.players.map((i) => (
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

export default Play;

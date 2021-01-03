import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Box,
  Heading,
  Select,
  HStack,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createBingoCard } from "../../components/CardGenerator";
import { CardModel, Game, Player, SquareModel } from "../../components/Model";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

function Bingo() {
  let [session, setSession] = useState(null);
  const [group, setGroup] = useState(null);
  const [caller, setCaller] = useState("");
  const router = useRouter();
  const { groupid } = router.query;
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
      .select(
        `id,name,owner,groupmember(id, name, email),game(id,caller,started,created,completed)`
      )
      .eq("id", groupid);
    if (group && group.length === 1) setGroup(group[0]);
    else return;

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
  }

  async function createGame() {
    alert("here");
    const { data, error } = await supabase
      .from("game")
      .insert([{ caller: caller, group: groupid, calledNumbers: [] }]);
    if (error) {
      alert(error.message);
    } else {
      let gameId = data[0].id;
      var insertArr = [];
      group.groupmember.forEach((mem) => {
        insertArr.push({
          game: gameId,
          name: mem.name,
          email: mem.email,
          card: createBingoCard(),
        });
      });
      const { d, e } = await supabase.from("player").insert(insertArr);
      fetchMembers();
    }
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Heading paddingBottom="20px">
        {group && "Play bingo with " + group.name + "!"}
      </Heading>

      <HStack paddingBottom="20px">
        <Text>Pick the caller for the game</Text>
        <Select
          placeholder="Select option"
          maxW="sm"
          value={caller}
          onChange={(e) => setCaller(e.target.value)}
        >
          {group &&
            group.groupmember.map((gm) => (
              <option value={gm.email}>{gm.name}</option>
            ))}
        </Select>
        <Button
          colorScheme="teal"
          disabled={!caller}
          onClick={() => {
            createGame();
          }}
        >
          Start
        </Button>
      </HStack>

      <Heading as="h4" size="md" paddingBottom="20px">
        Games
      </Heading>

      <Table variant="striped" colorScheme="gray" size="md">
        <Thead>
          <Tr>
            <Th>Started on</Th>
            <Th>Caller</Th>
            <Th>Status</Th>
            <Th>Link to the game</Th>
          </Tr>
        </Thead>
        <Tbody>
          {group &&
            group.game.map((gm) => (
              <Tr>
                <Td>{gm.created}</Td>
                <Td>{gm.caller}</Td>
                <Td>
                  {gm.completed ? (
                    <Badge colorScheme="green" variant="outline">
                      Completed
                    </Badge>
                  ) : gm.started ? (
                    <Badge colorScheme="blue" variant="outline">
                      Started
                    </Badge>
                  ) : (
                    <Badge colorScheme="purple" variant="outline">
                      Not Started
                    </Badge>
                  )}
                </Td>
                <Td>
                  <Link href={"/bingo/game/" + gm.id}>
                    <Button color="green.500">View</Button>
                  </Link>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default Bingo;

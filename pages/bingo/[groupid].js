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
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { createBingoCard } from "../../components/CardGenerator";
import { CardModel, Game, Player, SquareModel } from "../../components/Model";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import UserContext from "../../lib/UserContext";

function Bingo() {
  const [group, setGroup] = useState(null);
  const [caller, setCaller] = useState("");
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { groupid } = router.query;
  const toast = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    if (!user) {
      router.push("/");
      return;
    }
    let { data: group, error } = await supabase
      .from("group")
      .select(
        `id,name,owner,groupmember(id, name, email),game(id,caller,started,created,completed)`
      )
      .eq("id", groupid)
      .order("created");
    if (group && group.length === 1) {
      if (group[0].groupmember.find((m) => m.email === user.email))
        setGroup(group[0]);
      else {
        router.push("/groups");
        return;
      }
    } else router.push("/groups");

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
    const { data, error } = await supabase
      .from("game")
      .insert([{ caller: caller, group: groupid, calledNumbers: [] }]);
    if (error) {
      toast({
        title: "failed to create game",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
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
        <Select
          placeholder="Pick the caller for the game"
          maxW="sm"
          value={caller}
          onChange={(e) => setCaller(e.target.value)}
        >
          {group &&
            group.groupmember.map((gm) => (
              <option value={gm.email} key={gm.email}>
                {gm.name}
              </option>
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
      <Text>Click anywhere on the row to view the game</Text>
      <Box>
        <Table variant="striped" colorScheme="gray" maxW="lg">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Caller</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {group &&
              group.game.reverse().map((gm) => (
                <Link
                  href={"/bingo/" + groupid + "/" + gm.id}
                  key={"game-" + gm.id}
                >
                  <Tr>
                    <Td>{gm.created.substring(0, 10)}</Td>
                    <Td>
                      {
                        group.groupmember.find((p) => p.email === gm.caller)
                          .name
                      }
                    </Td>
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
                  </Tr>
                </Link>
              ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default Bingo;

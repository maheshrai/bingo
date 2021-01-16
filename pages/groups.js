import { useState, useEffect, useContext } from "react";
import {
  Wrap,
  WrapItem,
  Avatar,
  Box,
  Heading,
  Button,
  HStack,
  Spacer,
  Text,
  Divider,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { AddIcon, DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import UserContext from "../lib/UserContext";

function Groups() {
  const [groupName, setGroupName] = useState("");
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState([]);

  const handleGroupNameChange = (event) => setGroupName(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleOwnerNameChange = (event) => setOwnerName(event.target.value);

  const toast = useToast();

  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    fetchMyGroups();
  }, []);

  async function fetchMyGroups() {
    let { data: groupmember, error } = await supabase
      .from("groupmember")
      .select("group")
      .eq("email", user.email);

    if (!error) {
      let ids = groupmember.map((gm) => gm.group);
      let { data: group } = await supabase
        .from("group")
        .select(`id,name,owner,groupmember(id, name)`)
        .in("id", ids);
      console.log(JSON.stringify(group));
      setGroups(group);
    }
  }

  async function deleteGroup(id) {
    // delete the game and players
    let { data: gm, error } = await supabase
      .from("game")
      .select(`id,player(id)`)
      .eq("group", id);
    if (!error) {
      let playerids = [];
      gm.forEach((g) => {
        g.player.forEach((p) => playerids.push(p.id));
      });
      // delete players
      await supabase.from("player").delete().in("id", playerids);
      // dlete game
      await supabase.from("game").delete().eq("group", id);
      // delete group members
      await supabase.from("groupmember").delete().eq("group", id);
      // delet ethe group
      const { data, error } = await supabase
        .from("group")
        .delete()
        .eq("id", id);
      if (!error) {
        fetchMyGroups();
      } else {
        toast({
          title: "failed to delete group",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    }
  }

  async function addGroupMember(group) {
    const { data, error } = await supabase
      .from("groupmember")
      .insert([{ group: group, name: name, email: email }]);
    fetchMyGroups();
  }

  async function createGroup() {
    const { data: group, error } = await supabase
      .from("group")
      .insert([{ name: groupName, owner: user.email }]);
    if (error) {
      console.log("Error logging out:", error.message);
      toast({
        title: "failed to create group",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      const { data, error } = await supabase
        .from("groupmember")
        .insert([{ group: group[0].id, name: ownerName, email: user.email }]);
      toast({
        title: "Group created",
        description: "Group was created. " + group[0].id,
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      fetchMyGroups();
    }
  }

  return (
    <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
      <Box padding="10px">
        <HStack>
          <Heading as="h3" size="lg">
            Bingo Groups
          </Heading>
          <Popover>
            <PopoverTrigger>
              <IconButton color="green.500" icon={<AddIcon />} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Create a new group</PopoverHeader>
              <PopoverBody>
                <FormControl id="email">
                  <FormLabel>Name of your new bingo group</FormLabel>
                  <Input
                    type="text"
                    onChange={handleGroupNameChange}
                    value={groupName}
                  />
                </FormControl>
                <FormControl id="name" paddingTop="10px">
                  <FormLabel>Your name in the group</FormLabel>
                  <Input
                    type="text"
                    onChange={handleOwnerNameChange}
                    value={ownerName}
                  />
                </FormControl>
                <HStack paddingTop="10px">
                  <Spacer></Spacer>
                  <Button
                    colorScheme="green"
                    onClick={async () => createGroup()}
                  >
                    Create
                  </Button>
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Box>
      <Wrap spacing="30px">
        {groups &&
          groups.map((g) => (
            <WrapItem key={"group-" + g.id}>
              <Box
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <HStack paddingLeft="5px">
                  <Heading as="h3" size="md">
                    {g.name}
                  </Heading>
                  <Spacer></Spacer>
                  {user.email === g.owner && (
                    <IconButton
                      aria-label="Delete group"
                      color="tomato"
                      onClick={() => deleteGroup(g.id)}
                      icon={<DeleteIcon />}
                    />
                  )}
                </HStack>
                <Divider></Divider>
                <HStack padding="10px">
                  <Text>Members</Text>
                </HStack>
                <Wrap>
                  <WrapItem>
                    <Box p="6">
                      <Wrap>
                        {g.groupmember.map((gm) => (
                          <WrapItem key={"group-" + g.id + "-" + gm.name}>
                            <Tooltip label={gm.name} fontSize="md">
                              <Avatar name={gm.name} />
                            </Tooltip>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </WrapItem>
                </Wrap>
                <HStack>
                  <Spacer></Spacer>

                  <Popover>
                    <PopoverTrigger>
                      <IconButton
                        aria-label="Edit"
                        icon={<PlusSquareIcon />}
                        color="blue.500"
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Add member</PopoverHeader>
                      <PopoverBody>
                        <FormControl id="name">
                          <FormLabel>Name</FormLabel>
                          <Input
                            type="text"
                            onChange={handleNameChange}
                            value={name}
                          />
                          <FormHelperText>Name of the member</FormHelperText>
                        </FormControl>
                        <FormControl id="email">
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="text"
                            onChange={handleEmailChange}
                            value={email}
                          />
                          <FormHelperText>Email of the member</FormHelperText>
                        </FormControl>
                        <HStack>
                          <Spacer></Spacer>
                          <Button
                            colorScheme="green"
                            onClick={async () => addGroupMember(g.id)}
                          >
                            Add
                          </Button>
                        </HStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Link href={"/bingo/" + g.id}>
                    <Button color="green.500">Play</Button>
                  </Link>
                </HStack>
              </Box>
            </WrapItem>
          ))}
      </Wrap>
    </Box>
  );
}

export default Groups;

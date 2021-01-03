import { useState, useEffect } from "react";
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
  VStack,
  Divider,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  PlusSquareIcon,
  SearchIcon,
} from "@chakra-ui/icons";

function Groups() {
  let [session, setSession] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState([]);

  const handleGroupNameChange = (event) => setGroupName(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);

  const toast = useToast();

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    fetchMyGroups();
  }, []);

  async function fetchMyGroups() {
    let email = supabase.auth.session().user.email;
    let { data: group, error } = await supabase
      .from("group")
      .select(`id,name,owner,groupmember(id, name)`)
      .eq("owner", email);
    console.log(JSON.stringify(group));
    setGroups(group);
  }

  async function deleteGroup(id) {
    let deleted = await supabase.from("groupmember").delete().eq("group", id);
    deleted = await supabase.from("group").delete().eq("id", id);
    fetchMyGroups();
  }

  async function addGroupMember(group) {
    const { data, error } = await supabase
      .from("groupmember")
      .insert([{ name: name, email: email, group: group }]);
    fetchMyGroups();
  }

  async function createGroup() {
    const { data, error } = await supabase
      .from("group")
      .insert([{ name: groupName, owner: session.user.email }]);
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
      // Add the owner as group member
      const { d, e } = await supabase.from("groupmember").insert([
        {
          group: data[0].id,
          name: session.user.email,
          email: session.user.email,
        },
      ]);
      console.log(JSON.stringify(data));
      toast({
        title: "Group created",
        description: "Group was created. " + data[0].id,
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
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    onChange={handleGroupNameChange}
                    value={groupName}
                  />
                  <FormHelperText>Name of your new bingo group</FormHelperText>
                </FormControl>
                <HStack>
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
            <WrapItem>
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
                  {session.user.email === g.owner && (
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
                          <WrapItem>
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

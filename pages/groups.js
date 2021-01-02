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
  const [groups, setGroups] = useState([]);

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
      .select(`id,name,owner,groupmember(group)`)
      .eq("owner", email);
    console.log(JSON.stringify(group));
    setGroups(group);
  }

  const handleInputChange = (event) => setGroupName(event.target.value);

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
                    onChange={handleInputChange}
                    value={groupName}
                  />
                  <FormHelperText>Name of your new bingo group</FormHelperText>
                </FormControl>
                <HStack>
                  <Spacer></Spacer>
                  <Button
                    colorScheme="green"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from("group")
                        .insert([
                          { name: groupName, owner: session.user.email },
                        ]);
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
                        console.log(JSON.stringify(data));
                        toast({
                          title: "Groiup created",
                          description: "Group was created. " + data[0].id,
                          status: "success",
                          duration: 1000,
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    Create
                  </Button>
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Box>
      <Wrap>
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
                  <IconButton
                    aria-label="Delete group"
                    color="tomato"
                    icon={<DeleteIcon />}
                  />
                </HStack>
                <Divider></Divider>
                <HStack padding="10px">
                  <Text>Members</Text>
                </HStack>
                <Wrap>
                  <WrapItem>
                    <Box p="6">
                      <Wrap>
                        {groups &&
                          groups.groupmember &&
                          groups.groupmember.map((g) => (
                            <WrapItem>
                              <Tooltip label="Jimmie Hayes" fontSize="md">
                                <Avatar name="mahesh.rai@gmail.com" />
                              </Tooltip>
                            </WrapItem>
                          ))}
                      </Wrap>
                    </Box>
                  </WrapItem>
                </Wrap>
                <HStack>
                  <Spacer></Spacer>

                  <IconButton
                    aria-label="Edit"
                    icon={<PlusSquareIcon />}
                    color="blue.500"
                  />

                  <Link href="/bingo/1">
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

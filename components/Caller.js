import { useState } from "react";
import { Center, Box, SimpleGrid, Button, VStack } from "@chakra-ui/react";
import { getRandomIntInclusive } from "./CardGenerator";
export function Caller(props) {
  const numbers = [];
  for (var i = 1; i <= 90; i++) {
    numbers.push(i);
  }
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [notCalledNumbers, setNotCalledNumbers] = useState([...numbers]);
  function callNumber() {
    var r = getRandomIntInclusive(0, notCalledNumbers.length - 1);
    r = notCalledNumbers[r];
    setCalledNumbers((c) => {
      const arr = [...calledNumbers];
      arr.push(r);
      props.updateNumbersCalled(arr);
      return arr;
    });
    setNotCalledNumbers((c) => {
      const arr = numbers.filter((n) => !calledNumbers.includes(n));
      return arr;
    });
  }
  return (
    <VStack>
      <SimpleGrid columns={9} spacing={1}>
        {numbers.map((i) => (
          <Center
            w="35px"
            h="35px"
            bg={!calledNumbers.includes(i) ? "tomato" : "green.200"}
            color="black.500"
            key={i}
          >
            <Box as="span" fontWeight="bold" fontSize="lg">
              {i}
            </Box>
          </Center>
        ))}
      </SimpleGrid>
      <Button colorScheme="blue" onClick={() => callNumber()}>
        Call Next Number
      </Button>
    </VStack>
  );
}

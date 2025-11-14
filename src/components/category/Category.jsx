import { Box, Heading, Text, VStack, Badge, Icon } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

function Category({ data }) {
  return (
    <Box
      w={"100%"}
      p={5}
      borderRadius="md"
      bg="bg-card"
      color="white"
      shadow="md"
      transition="0.2s"
      _hover={{
        transform: "scale(1.001)",
        shadow: "lg",
        bg: "bg-card-status",
      }}
      cursor="pointer">
      <Heading size="md" mb={3}>
        {data.title}
      </Heading>

      <VStack spacing={2}>
        {/* <Icon as={StarIcon} color="yellow.300" /> */}
        <Text fontSize="sm" w="100%">
          عدد الوجبات :{" "}
          <Badge colorScheme="green" px={2} py={1} borderRadius="md">
            {data.meals.length}
          </Badge>
        </Text>

        <Text>
          تاريخ الانشاء :
          <Badge
            colorScheme="green"
            px={2}
            py={1}
            borderRadius={"md"}
            size={"xs"}>
            {data.created_at}
          </Badge>
        </Text>
      </VStack>
    </Box>
  );
}

export default Category;

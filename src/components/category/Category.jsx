import { Box, Heading, Text, VStack, Badge, Icon } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { BansheeContext } from "../../hooks/bansheeContext";

function Category({ data }) {
  const { fMeals, setCategorMealsList, filter_meals } =
    useContext(BansheeContext);

  const handelFilterMeals = () => {
    console.log(fMeals);
    setCategorMealsList(data);
    filter_meals(data.id);
  };

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
      }}>
      <Heading
        size="md"
        mb={3}
        cursor="pointer"
        onClick={() => handelFilterMeals()}>
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

        <Box w={"100%"} h="auto" cursor={"pointer"}>
          <Icon as={EditIcon} color="info" m={"0px 7px"} />
          <Icon as={DeleteIcon} color="error" m={"0px 7px"} />
        </Box>
      </VStack>
    </Box>
  );
}

export default Category;

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { BansheeContext } from "../../hooks/bansheeContext";

function Meal({ data }) {
  const { fMeals } = useContext(BansheeContext);

  const handelFilterMeals = () => {
    console.log(fMeals);
  };

  return (
    <Box
      w="100%"
      p={5}
      borderRadius="md"
      bg="bg-card"
      color="white"
      shadow="md"
      transition="0.2s"
      _hover={{
        transform: "scale(1.01)",
        shadow: "lg",
        bg: "bg-card-status",
      }}>
      {/* Title + Price */}
      <HStack justify="space-between" mb={2}>
        <Heading size="md" cursor="pointer" onClick={handelFilterMeals}>
          {data.title}
        </Heading>

        <Badge
          colorScheme="green"
          px={3}
          py={1}
          borderRadius="md"
          fontSize="sm">
          {data.price} $
        </Badge>
      </HStack>

      {/* Description */}
      <Text fontSize="sm" opacity={0.85} mb={3}>
        {data.description || "لا يوجد وصف للوجبة"}
      </Text>

      <Divider opacity={0.2} mb={3} />

      <VStack spacing={2} align="start">
        {/* Created at */}
        <HStack>
          <Text fontSize="xs">تاريخ الانشاء:</Text>
          <Badge colorScheme="green" px={2} py={1} borderRadius="md" size="xs">
            {data.created_at}
          </Badge>
        </HStack>

        {/* Actions */}
        <HStack w="100%" justify="flex-end" pt={2}>
          <Icon
            as={EditIcon}
            color="info"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          />
          <Icon
            as={DeleteIcon}
            color="error"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          />
        </HStack>
      </VStack>
    </Box>
  );
}

export default Meal;

import {
  Badge,
  Box,
  Text,
  IconButton,
  Flex,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function Sale({ sale }) {
  return (
    <Box
      w="100%"
      maxW="400px"
      minH="180px"
      p={4}
      borderRadius="lg"
      bg="bg-card"
      transition="all 0.2s"
      _hover={{
        boxShadow: "3px 5px 3px black",
        transform: "translateY(-2px)",
      }}>
      <Flex direction="column" height="100%">
        {/* Header Section */}
        <Flex justify="space-between" align="start" mb={3}>
          <VStack align="start" spacing={1} flex="1">
            <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
              {sale.title}
            </Text>
          </VStack>

          <Badge
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
            colorScheme="green">
            مكتمل
          </Badge>
        </Flex>

        <Divider my={2} />

        {/* Details Section */}
        <Flex direction="column" flex="1" justify="space-between">
          <HStack spacing={4} mb={3} wrap="wrap">
            <VStack align="center" spacing={1}>
              <Text fontSize="xs" color="white">
                الكمية
              </Text>
              <Badge
                colorScheme="blue"
                px={3}
                py={1}
                fontSize="sm"
                borderRadius="md">
                {sale.count || 0}
              </Badge>
            </VStack>

            <VStack align="center" spacing={1}>
              <Text fontSize="xs" color="white">
                السعر
              </Text>
              <Badge
                colorScheme="purple"
                px={3}
                py={1}
                fontSize="sm"
                borderRadius="md">
                {sale.price} $
              </Badge>
            </VStack>

            <VStack align="center" spacing={1}>
              <Text fontSize="xs" color="white">
                الإجمالي
              </Text>
              <Badge
                colorScheme="green"
                px={3}
                py={1}
                fontSize="sm"
                borderRadius="md">
                {sale.price} $
              </Badge>
            </VStack>
          </HStack>

          {/* Footer Section */}
          <Flex justify="space-between" align="center" mt="auto">
            <Text fontSize="xs" color="white">
              🗓️ {sale.created_at}
            </Text>

            <HStack spacing={2}>
              <IconButton
                icon={<DeleteIcon />}
                size="md"
                colorScheme="red"
                variant="solid"
                aria-label="حذف"
                title="حذف"
              />
            </HStack>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

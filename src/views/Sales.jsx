import Sale from "../components/sales/sale";
import {
  Box,
  Heading,
  VStack,
  Text,
  Badge,
  SimpleGrid,
  Skeleton,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useContext } from "react";
import { BansheeContext } from "../hooks/bansheeContext";

export default function Sales() {
  const { meals } = useContext(BansheeContext);

  // Mock sales data - replace with actual data from context
  const salesData = [
    ...meals,
    // Add more sales data...
  ];

  return (
    <Box p={4}>
      <VStack w="100%" spacing={4} align="stretch">
        {/* Header */}
        <Box
          p={4}
          borderBottom="1px solid"
          borderColor="gray.200"
          display="flex"
          justifyContent="space-between"
          alignItems="center">
          <Heading size="md" color="green.300">
            مؤشر المبيعات
          </Heading>
          <Badge p={2} colorScheme="green" fontSize="xs">
            عدد المبيعات : {meals.length} / الصندوق : {meals.length} $ / 🔻 / 🔺
          </Badge>
        </Box>

        {/* Meals Summary */}
        <Box>
          <Heading size="sm" mb={3}>
            الوجبات المباعة
          </Heading>
          {!meals ? (
            <Skeleton height="50px" />
          ) : meals.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              لا توجد وجبات متاحة
            </Alert>
          ) : (
            <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={2}>
              {meals.map((ele, index) => (
                <Badge
                  key={index}
                  p={2}
                  textAlign="center"
                  borderRadius="md"
                  colorScheme="green"
                  variant="subtle">
                  {ele.title || "No name"} : 0
                </Badge>
              ))}
            </SimpleGrid>
          )}
        </Box>

        <Heading size="sm" mb={3}>
          المبيعات التفصيلية
        </Heading>
        {/* Sales List */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={2}>
          {salesData.length > 0 ? (
            salesData.map((sale) => <Sale key={sale.id} sale={sale} />)
          ) : (
            <Text p="5px" bg="bg-card" borderRadius="5px">
              😔لا توجد مبيعات لعرضها😔
            </Text>
          )}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

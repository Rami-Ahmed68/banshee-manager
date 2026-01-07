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
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { useContext } from "react";
import { BansheeContext } from "../hooks/bansheeContext";

export default function Sales() {
  const { meals, sales } = useContext(BansheeContext);

  // حساب إحصائيات المبيعات
  const calculateStats = () => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (sale.totalPrice || 0),
      0
    );
    const totalItems = sales.reduce(
      (sum, sale) =>
        sum +
        (sale.products?.reduce(
          (productSum, product) => productSum + (product.quantity || 1),
          0
        ) || 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter(
      (sale) =>
        sale.createdAt?.split("T")[0] === today ||
        sale.created_at?.split("T")[0] === today
    );
    const todayRevenue = todaySales.reduce(
      (sum, sale) => sum + (sale.totalPrice || 0),
      0
    );

    return {
      totalSales,
      totalRevenue,
      totalItems,
      todaySales: todaySales.length,
      todayRevenue,
      avgSale: totalSales > 0 ? totalRevenue / totalSales : 0,
    };
  };

  const stats = calculateStats();

  return (
    <Box p={4}>
      <VStack w="100%" spacing={6} align="stretch">
        {/* الرأس مع الإحصائيات */}
        <Box p={4} borderRadius="lg" bg="bg-secondary" boxShadow="md">
          <HStack justify="space-between" align="center" mb={3}>
            <HStack spacing={3}>
              <Heading size="lg" color="green.300">
                لوحة تحكم المبيعات
              </Heading>
              <Badge
                colorScheme="green"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs">
                📈 Real-time
              </Badge>
            </HStack>

            <HStack spacing={2}>
              <Badge
                colorScheme="blue"
                variant="solid"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={1}>
                📊 تحليلات المبيعات
              </Badge>
              <Badge
                colorScheme="purple"
                variant="outline"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs">
                {new Date().toLocaleDateString("ar-SA")}
              </Badge>
            </HStack>
          </HStack>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {/* إجمالي المبيعات */}
            <Stat>
              <StatLabel color="gray.300">
                <HStack>
                  <Text>إجمالي المبيعات</Text>
                  <Badge
                    colorScheme="blue"
                    fontSize="xx-small"
                    px={1}
                    borderRadius="sm">
                    الكل
                  </Badge>
                </HStack>
              </StatLabel>
              <StatNumber color="white" fontSize="2xl">
                {stats.totalSales}
              </StatNumber>
              <HStack mt={1}>
                <Badge
                  colorScheme="green"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="full">
                  {stats.todaySales} اليوم
                </Badge>
                <Badge
                  colorScheme={stats.totalSales > 0 ? "green" : "gray"}
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={0.5}>
                  {stats.totalSales > 0 ? "✅ نشط" : "⏸️ غير نشط"}
                </Badge>
              </HStack>
            </Stat>

            {/* إجمالي الإيرادات */}
            <Stat>
              <StatLabel color="gray.300">
                <HStack>
                  <Text>إجمالي الإيرادات</Text>
                  <Badge
                    colorScheme="green"
                    fontSize="xx-small"
                    px={1}
                    borderRadius="sm">
                    ر.س
                  </Badge>
                </HStack>
              </StatLabel>
              <StatNumber color="white" fontSize="2xl">
                {stats.totalRevenue.toLocaleString()} ل.س
              </StatNumber>
              <HStack mt={1} spacing={2}>
                <Badge
                  colorScheme="yellow"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="full">
                  {stats.todayRevenue.toLocaleString()} اليوم
                </Badge>
                {stats.todayRevenue > 0 && (
                  <Badge
                    colorScheme="orange"
                    variant="solid"
                    fontSize="xs"
                    px={2}
                    py={0.5}>
                    🔥 نشاط اليوم
                  </Badge>
                )}
              </HStack>
            </Stat>

            {/* إجمالي العناصر */}
            <Stat>
              <StatLabel color="gray.300">
                <HStack>
                  <Text>إجمالي العناصر</Text>
                  <Badge
                    colorScheme="yellow"
                    fontSize="xx-small"
                    px={1}
                    borderRadius="sm">
                    قطعة
                  </Badge>
                </HStack>
              </StatLabel>
              <StatNumber color="white" fontSize="2xl">
                {stats.totalItems}
              </StatNumber>
              <HStack mt={1}>
                <Badge
                  colorScheme="teal"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="full">
                  معدل: {(stats.totalItems / stats.totalSales || 0).toFixed(1)}
                  /عملية
                </Badge>
                {stats.totalItems > 50 && (
                  <Badge
                    colorScheme="red"
                    variant="outline"
                    fontSize="xx-small"
                    px={1}
                    py={0}>
                    🔥 مزدحم
                  </Badge>
                )}
              </HStack>
            </Stat>

            {/* متوسط الفاتورة */}
            <Stat>
              <StatLabel color="gray.300">
                <HStack>
                  <Text>متوسط الفاتورة</Text>
                  <Badge
                    colorScheme="purple"
                    fontSize="xx-small"
                    px={1}
                    borderRadius="sm">
                    متوسط
                  </Badge>
                </HStack>
              </StatLabel>
              <StatNumber color="white" fontSize="2xl">
                {stats.avgSale.toLocaleString()} ل.س
              </StatNumber>
              <HStack mt={1}>
                <Badge
                  colorScheme="cyan"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="full">
                  لكل عملية بيع
                </Badge>
                {stats.avgSale > 1000 && (
                  <Badge
                    colorScheme="pink"
                    variant="subtle"
                    fontSize="xx-small"
                    px={1}
                    py={0}>
                    💎 فاخر
                  </Badge>
                )}
              </HStack>
            </Stat>
          </SimpleGrid>

          {/* Summary Badges */}
          <HStack justify="center" mt={4} spacing={3} wrap="wrap">
            <Badge
              colorScheme={stats.totalSales > 0 ? "green" : "gray"}
              variant="solid"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm">
              {stats.totalSales > 0 ? "🎯 مبيعات نشطة" : "📭 لا توجد مبيعات"}
            </Badge>

            <Badge
              colorScheme={stats.todayRevenue > 500 ? "orange" : "blue"}
              variant="subtle"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm">
              {stats.todayRevenue > 500 ? "🚀 يوم متميز" : "📅 يوم عادي"}
            </Badge>

            <Badge
              colorScheme={stats.avgSale > 1000 ? "purple" : "teal"}
              variant="outline"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm">
              {stats.avgSale > 1000 ? "💰 قيمة عالية" : "💵 قيمة متوسطة"}
            </Badge>

            <Badge
              colorScheme="gray"
              variant="solid"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm"
              display="flex"
              alignItems="center"
              gap={1}>
              ⏱️{" "}
              {new Date().toLocaleTimeString("ar-SA", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Badge>
          </HStack>
        </Box>

        {/* ملخص الوجبات الأكثر مبيعاً */}
        <Box p={4} borderRadius="lg" bg="bg-card">
          <Heading size="md" mb={4} color="white">
            الوجبات الأكثر مبيعاً
          </Heading>

          {!meals ? (
            <Skeleton height="50px" />
          ) : meals.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              لا توجد وجبات متاحة
            </Alert>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
              {meals.slice(0, 8).map((meal) => {
                // حساب إجمالي مبيعات هذه الوجبة
                const totalSold = sales.reduce((total, sale) => {
                  const mealInSale = sale.products?.find(
                    (product) => product.id === meal.id
                  );
                  return total + (mealInSale?.quantity || 0);
                }, 0);

                const totalRevenue = sales.reduce((total, sale) => {
                  const mealInSale = sale.products?.find(
                    (product) => product.id === meal.id
                  );
                  return total + (mealInSale?.totalPrice || 0);
                }, 0);

                return (
                  <Box
                    key={meal.id || meal._id}
                    p={3}
                    borderRadius="md"
                    bg="whiteAlpha.100"
                    _hover={{ bg: "whiteAlpha.200" }}
                    transition="0.2s">
                    <Text fontWeight="bold" color="white" noOfLines={1} mb={1}>
                      {meal.title || "وجبة بدون اسم"}
                    </Text>
                    <HStack justify="space-between">
                      <Badge colorScheme="orange" fontSize="s">
                        {totalSold} مبيع
                      </Badge>
                      <Text fontSize="sm" color="green.300">
                        {totalRevenue.toLocaleString()} ل.س
                      </Text>
                    </HStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          )}

          {meals.length > 8 && (
            <Text textAlign="center" mt={3} color="gray.400" fontSize="sm">
              + {meals.length - 8} وجبات أخرى
            </Text>
          )}
        </Box>

        {/* قائمة المبيعات التفصيلية */}
        <Box p={4} borderRadius="lg" bg="bg-card">
          <Heading size="md" mb={4} color="white">
            أحدث المبيعات
          </Heading>

          {sales.length === 0 ? (
            <Box p={8} textAlign="center" bg="whiteAlpha.50" borderRadius="lg">
              <Text fontSize="lg" color="gray.400" mb={2}>
                📭 لا توجد مبيعات مسجلة بعد
              </Text>
              <Text fontSize="sm" color="gray.500">
                ابدأ بعمليات البيع لتراها هنا
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
              {sales
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || b.created_at || 0) -
                    new Date(a.createdAt || a.created_at || 0)
                )
                .map((saleItem, index) => (
                  <Sale
                    key={index}
                    data={saleItem} // ✅ اسم الـ prop الصحيح
                  />
                ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Box>
  );
}

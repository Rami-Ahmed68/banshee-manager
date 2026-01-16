import {
  Badge,
  Box,
  Text,
  IconButton,
  Flex,
  VStack,
  HStack,
  Divider,
  Collapse,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { BansheeContext } from "../../hooks/bansheeContext";

export default function Sale({ data }) {
  const { sales, setSales } = useContext(BansheeContext);
  const [isExpanded, setIsExpanded] = useState(false);

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    try {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("ar-SA", options);
    } catch (error) {
      return dateString;
    }
  };

  // تنسيق العملة
  const formatCurrency = (amount) => {
    return amount?.toLocaleString() || "0";
  };

  // حساب إجمالي عدد القطع
  const calculateTotalItems = () => {
    if (!data.products || !Array.isArray(data.products)) return 0;
    return data.products.reduce(
      (total, product) => total + (product.quantity || 1),
      0
    );
  };

  // حساب إجمالي السعر
  const calculateTotalPrice = () => {
    if (!data.products || !Array.isArray(data.products)) return 0;
    return data.products.reduce(
      (total, product) => total + (product.totalPrice || 0),
      0
    );
  };

  // حذف الفاتورة
  const deleteSale = () => {
    if (window.confirm(`هل أنت متأكد من حذف الفاتورة رقم ${data.index}؟`)) {
      setSales((prev) => prev.filter((sale) => sale.index !== data.index));
    }
  };

  // عرض أول منتجين فقط في الملخص
  const getProductSummary = () => {
    if (!data.products || !Array.isArray(data.products)) return [];
    return data.products.slice(0, 2);
  };

  const totalItems = calculateTotalItems();
  const totalPrice = calculateTotalPrice() || data.totalPrice || 0;
  const productCount = data.products?.length || 0;

  return (
    <Box
      w="100%"
      maxW="400px"
      minH={isExpanded ? "300px" : "200px"}
      p={4}
      borderRadius="lg"
      bg="bg-card" // اللون الأصلي
      transition="all 0.2s"
      boxShadow="0px 3px 5px black"
      _hover={{
        boxShadow: "3px 5px 3px black",
        transform: "translateY(-2px)",
      }}>
      <Flex direction="column" height="100%">
        {/* الرأس - رقم الفاتورة والحالة */}
        <Flex justify="space-between" align="center" mb={3}>
          <VStack align="start" spacing={1}>
            <HStack>
              <Badge
                colorScheme="blue"
                borderRadius="md"
                px={3}
                py={1}
                fontSize="sm">
                فاتورة #{data.index || "N/A"}
              </Badge>
              <Badge
                colorScheme="purple"
                borderRadius="md"
                px={2}
                py={1}
                fontSize="xs">
                {productCount} منتج
              </Badge>
            </HStack>
            <Text fontSize="xs" color="gray.300">
              {totalItems} قطعة • {formatCurrency(totalPrice)} ر.س
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

        {/* ملخص المنتجات */}
        <Box mb={3}>
          <Text fontSize="sm" fontWeight="bold" mb={2} color="white">
            المنتجات:
          </Text>
          <VStack align="stretch" spacing={2}>
            {getProductSummary().map((product, index) => (
              <HStack
                key={index}
                justify="space-between"
                p={2}
                bg="whiteAlpha.100"
                borderRadius="md">
                <Text fontSize="sm" color="white" noOfLines={1} flex={1}>
                  {product.title || `منتج ${index + 1}`}
                </Text>
                <HStack spacing={2}>
                  <Badge colorScheme="yellow" fontSize="xs" px={2}>
                    {product.quantity}×
                  </Badge>
                  <Text fontSize="sm" color="green.300" fontWeight="medium">
                    {formatCurrency(
                      product.totalPrice || product.price * product.quantity
                    )}{" "}
                    ر.س
                  </Text>
                </HStack>
              </HStack>
            ))}

            {productCount > 2 && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                color="gray.400"
                _hover={{ color: "white" }}>
                {isExpanded ? "إخفاء" : `عرض ${productCount - 2} منتج إضافي`}
              </Button>
            )}
          </VStack>
        </Box>

        {/* الإحصائيات السريعة */}
        <Flex direction="column" flex="1" justify="space-between">
          <HStack spacing={4} mb={3} wrap="wrap" justify="center">
            <VStack align="center" spacing={1}>
              <Text fontSize="xs" color="white">
                القطع
              </Text>
              <Badge
                colorScheme="blue"
                px={3}
                py={1}
                fontSize="sm"
                borderRadius="md">
                {totalItems}
              </Badge>
            </VStack>

            <VStack align="center" spacing={1}>
              <Text fontSize="xs" color="white">
                المنتجات
              </Text>
              <Badge
                colorScheme="purple"
                px={3}
                py={1}
                fontSize="sm"
                borderRadius="md">
                {productCount}
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
                {formatCurrency(totalPrice)} ر.س
              </Badge>
            </VStack>
          </HStack>

          {/* تفاصيل إضافية (عند التوسيع) */}
          <Collapse in={isExpanded} animateOpacity>
            <Box mb={3} p={3} bg="whiteAlpha.100" borderRadius="md">
              <Text fontSize="sm" fontWeight="bold" mb={2} color="white">
                تفاصيل جميع المنتجات:
              </Text>
              <VStack align="stretch" spacing={2}>
                {data.products?.map((product, index) => (
                  <HStack
                    key={index}
                    justify="space-between"
                    p={2}
                    bg="blackAlpha.300"
                    borderRadius="md">
                    <Box flex={1}>
                      <Text fontSize="sm" color="white" noOfLines={1}>
                        {product.title || `منتج ${index + 1}`}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        السعر: {formatCurrency(product.price)} ر.س
                      </Text>
                    </Box>
                    <HStack spacing={2}>
                      <Badge colorScheme="yellow" fontSize="xs" px={2}>
                        {product.quantity}×
                      </Badge>
                      <Badge colorScheme="green" fontSize="xs" px={2}>
                        {formatCurrency(
                          product.totalPrice || product.price * product.quantity
                        )}{" "}
                        ر.س
                      </Badge>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Collapse>

          {/* التذييل - التاريخ والإجراءات */}
          <Flex justify="space-between" align="center" mt="auto">
            <Text fontSize="xs" color="white">
              🗓️ {formatDate(data.createdAt)}
            </Text>

            <HStack spacing={2}>
              <IconButton
                icon={<DeleteIcon />}
                size="md"
                colorScheme="red"
                variant="solid"
                aria-label="حذف"
                title="حذف"
                onClick={deleteSale}
              />
            </HStack>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

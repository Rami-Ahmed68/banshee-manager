import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Code,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DownloadIcon, CloseIcon } from "@chakra-ui/icons";

export default function Open() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedData = JSON.parse(content);

        validateJsonData(parsedData);
        setJsonData(parsedData);

        const calculatedStats = calculateStats(parsedData);
        setStats(calculatedStats);

        onOpen();
      } catch (err) {
        setError("خطأ في قراءة الملف. تأكد أنه ملف JSON صالح.");
        console.error("Error parsing JSON:", err);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("خطأ في قراءة الملف");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const validateJsonData = (data) => {
    if (!data || typeof data !== "object") {
      throw new Error("بيانات غير صالحة");
    }

    if (!data.metadata || !data.salesData) {
      throw new Error("بنية ملف JSON غير صحيحة");
    }
  };

  const calculateStats = (data) => {
    const salesData = data.salesData;
    let totalSales = 0;
    let itemsCount = 0;

    if (Array.isArray(salesData)) {
      itemsCount = salesData.length;
      totalSales = salesData.reduce((sum, sale) => {
        if (sale && typeof sale === "object") {
          return sum + (parseFloat(sale.totalPrice) || 0);
        }
        return sum;
      }, 0);
    } else if (salesData && typeof salesData === "object") {
      itemsCount = Object.keys(salesData).length;
      totalSales = Object.values(salesData).reduce((sum, sale) => {
        if (sale && typeof sale === "object") {
          return sum + (parseFloat(sale.totalPrice) || 0);
        }
        return sum;
      }, 0);
    }

    return {
      totalSales: totalSales,
      itemsCount: itemsCount,
      exportDate: data.metadata?.exportDate || "غير متوفر",
      arabicDate: data.metadata?.arabicDate || "غير متوفر",
      currency: data.metadata?.currency || "SAR",
    };
  };

  const handleOpenFile = () => {
    fileInputRef.current.click();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const resetData = () => {
    setJsonData(null);
    setStats(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to get product details from a sale
  const getProductDetails = (sale) => {
    if (
      !sale.products ||
      !Array.isArray(sale.products) ||
      sale.products.length === 0
    ) {
      return "لا توجد منتجات";
    }

    // If there's only one product
    if (sale.products.length === 1) {
      const product = sale.products[0];
      return `${product.title || "منتج"} × ${product.quantity || 1}`;
    }

    // If there are multiple products
    return `${sale.products.length} منتجات مختلفة`;
  };

  // Function to calculate total quantity in a sale
  const calculateTotalQuantity = (sale) => {
    if (!sale.products || !Array.isArray(sale.products)) return 0;

    return sale.products.reduce((total, product) => {
      return total + (parseInt(product.quantity) || 0);
    }, 0);
  };

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Card bg="bg-card" borderColor="border-primary">
          <CardHeader>
            <Heading size="lg" textAlign="center" color="text-primary">
              📂 نظام فتح ملفات المبيعات
            </Heading>
            <Text textAlign="center" color="text-secondary" mt={2}>
              فتح وعرض بيانات ملفات JSON المحفوظة مسبقاً
            </Text>
          </CardHeader>
        </Card>

        <Card bg="bg-card" borderColor="border-primary">
          <CardBody>
            <VStack spacing={6}>
              <Text color="text-primary" textAlign="center">
                اختر ملف JSON المحفوظ لعرض بيانات المبيعات والإحصائيات
              </Text>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json"
                style={{ display: "none" }}
              />

              <Button
                bg="bg-primary"
                color="white"
                _hover={{ bg: "primary.600" }}
                leftIcon={<DownloadIcon />}
                onClick={handleOpenFile}
                isLoading={loading}
                loadingText="جاري قراءة الملف..."
                size="lg"
                px={8}>
                اختر ملف JSON
              </Button>

              <Text fontSize="sm" color="text-muted" textAlign="center">
                يجب أن يكون الملف بصيغة JSON تم تصديرها من نظام حفظ المبيعات
              </Text>

              {error && (
                <Alert status="error" borderRadius="lg" mt={4}>
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>خطأ!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Box>
                  <CloseIcon cursor="pointer" onClick={() => setError(null)} />
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>

        {stats && (
          <Card bg="bg-card" borderColor="border-primary">
            <CardHeader>
              <Heading size="md" color="text-primary">
                📊 ملخص البيانات المستوردة
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Stat bg="bg-card-status" p={4} borderRadius="lg">
                  <StatLabel color="text-secondary">عدد المعاملات</StatLabel>
                  <StatNumber color="text-primary">
                    {stats.itemsCount}
                  </StatNumber>
                  <StatHelpText color="text-muted">عملية مبيعات</StatHelpText>
                </Stat>

                <Stat bg="bg-card-status" p={4} borderRadius="lg">
                  <StatLabel color="text-secondary">إجمالي المبيعات</StatLabel>
                  <StatNumber color="text-primary">
                    {formatCurrency(stats.totalSales)}
                  </StatNumber>
                  <StatHelpText color="text-muted">
                    {stats.currency}
                  </StatHelpText>
                </Stat>

                <Stat bg="bg-card-status" p={4} borderRadius="lg">
                  <StatLabel color="text-secondary">تاريخ التصدير</StatLabel>
                  <StatNumber color="text-primary" fontSize="lg">
                    {stats.arabicDate}
                  </StatNumber>
                  <StatHelpText color="text-muted">
                    {formatDate(stats.exportDate)}
                  </StatHelpText>
                </Stat>
              </SimpleGrid>

              <Flex justify="center" mt={6} gap={4}>
                <Button
                  bg="success"
                  color="white"
                  _hover={{ bg: "#2bb346ff" }}
                  onClick={onOpen}>
                  عرض التفاصيل الكاملة
                </Button>

                <Button
                  variant="outline"
                  borderColor="border-primary"
                  color="text-primary"
                  _hover={{ bg: "bg-link" }}
                  onClick={resetData}>
                  مسح البيانات
                </Button>
              </Flex>
            </CardBody>
          </Card>
        )}

        <Card bg="bg-card" borderColor="border-primary">
          <CardHeader>
            <Heading size="md" color="text-primary">
              💡 تعليمات الاستخدام
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Text color="text-primary">
                ✅ <strong>اختيار الملف:</strong> اضغط على زر "اختر ملف JSON"
                واختر الملف المحفوظ مسبقاً
              </Text>
              <Text color="text-primary">
                ✅ <strong>عرض البيانات:</strong> سيتم عرض ملخص البيانات
                والإحصائيات تلقائياً
              </Text>
              <Text color="text-primary">
                ✅ <strong>التفاصيل الكاملة:</strong> اضغط على "عرض التفاصيل
                الكاملة" لمشاهدة كافة البيانات
              </Text>
              <Text color="text-primary">
                ⚠️ <strong>ملاحظة:</strong> يتم عرض البيانات فقط ولا يتم حفظها
                في النظام
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent
          bg="bg-card"
          color="text-primary"
          borderColor="border-primary"
          maxW="1400px">
          <ModalHeader>
            <Heading size="lg">📄 بيانات ملف المبيعات</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {jsonData && (
              <VStack spacing={6} align="stretch">
                <Card bg="bg-card-status">
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontWeight="bold" color="text-secondary" mb={2}>
                          معلومات الملف
                        </Text>
                        <VStack align="start" spacing={1}>
                          <Text color="text-primary">
                            <strong>تاريخ التصدير:</strong>{" "}
                            {formatDate(jsonData.metadata?.exportDate)}
                          </Text>
                          <Text color="text-primary">
                            <strong>التاريخ الهجري:</strong>{" "}
                            {jsonData.metadata?.arabicDate}
                          </Text>
                          <Text color="text-primary">
                            <strong>العملة:</strong>{" "}
                            {jsonData.metadata?.currency}
                          </Text>
                        </VStack>
                      </Box>

                      <Box>
                        <Text fontWeight="bold" color="text-secondary" mb={2}>
                          الإحصائيات
                        </Text>
                        <VStack align="start" spacing={1}>
                          <Text color="text-primary">
                            <strong>عدد المبيعات:</strong> {stats?.itemsCount}
                          </Text>
                          <Text color="text-primary">
                            <strong>إجمالي المبيعات:</strong>{" "}
                            {formatCurrency(stats?.totalSales || 0)}
                          </Text>
                          <Text color="text-primary">
                            <strong>الحالة:</strong>{" "}
                            <Badge bg="success" color="white">
                              صالح
                            </Badge>
                          </Text>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card bg="bg-card-status">
                  <CardHeader>
                    <Heading size="md">📋 بيانات المبيعات التفصيلية</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box overflowX="auto">
                      {Array.isArray(jsonData.salesData) ? (
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr bg="bg-card">
                              <Th color="text-primary">#</Th>
                              <Th color="text-primary">التاريخ</Th>
                              <Th color="text-primary">رقم العملية</Th>
                              <Th color="text-primary">المنتجات</Th>
                              <Th color="text-primary">الكمية الكلية</Th>
                              <Th color="text-primary">الإجمالي</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {jsonData.salesData.map((sale, index) => (
                              <Tr key={index} _hover={{ bg: "bg-link" }}>
                                <Td color="text-primary">{index + 1}</Td>
                                <Td color="text-primary">
                                  {sale.createdAt
                                    ? formatDate(sale.createdAt)
                                    : "غير محدد"}
                                </Td>
                                <Td color="text-primary">
                                  <Code
                                    bg="bg-input"
                                    color="text-primary"
                                    p={1}
                                    borderRadius="md">
                                    {sale.index || "N/A"}
                                  </Code>
                                </Td>
                                <Td color="text-primary">
                                  {getProductDetails(sale)}
                                </Td>
                                <Td color="text-primary">
                                  {calculateTotalQuantity(sale)}
                                </Td>
                                <Td color="text-primary">
                                  <Badge bg="warning" color="white">
                                    {formatCurrency(sale.totalPrice || 0)}
                                  </Badge>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Alert status="info" borderRadius="lg">
                          <AlertIcon />
                          <Text>لا توجد بيانات مبيعات مفصلة</Text>
                        </Alert>
                      )}
                    </Box>
                  </CardBody>
                </Card>

                <Card bg="bg-card-status">
                  <CardHeader>
                    <Heading size="md">🛒 تفاصيل المنتجات في كل عملية</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {jsonData.salesData &&
                        Array.isArray(jsonData.salesData) &&
                        jsonData.salesData.map((sale, saleIndex) => (
                          <Card
                            key={saleIndex}
                            bg="bg-input"
                            borderColor="border-secondary">
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Flex
                                  justifyContent="space-between"
                                  width="100%">
                                  <Text fontWeight="bold" color="text-primary">
                                    العملية #{sale.index || saleIndex + 1}
                                  </Text>
                                  <Badge bg="purple" color="white">
                                    {formatCurrency(sale.totalPrice || 0)}
                                  </Badge>
                                </Flex>

                                <Text color="text-secondary" fontSize="sm">
                                  التاريخ:{" "}
                                  {sale.createdAt
                                    ? formatDate(sale.createdAt)
                                    : "غير محدد"}
                                </Text>

                                {sale.products &&
                                  Array.isArray(sale.products) &&
                                  sale.products.length > 0 && (
                                    <Table
                                      variant="simple"
                                      size="sm"
                                      width="100%">
                                      <Thead>
                                        <Tr>
                                          <Th color="text-secondary">المنتج</Th>
                                          <Th color="text-secondary">الكمية</Th>
                                          <Th color="text-secondary">
                                            سعر الوحدة
                                          </Th>
                                          <Th color="text-secondary">
                                            الإجمالي
                                          </Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {sale.products.map(
                                          (product, productIndex) => (
                                            <Tr key={productIndex}>
                                              <Td color="text-primary">
                                                {product.title ||
                                                  `منتج ${product.id}`}
                                              </Td>
                                              <Td color="text-primary">
                                                {product.quantity || 1}
                                              </Td>
                                              <Td color="text-primary">
                                                {formatCurrency(
                                                  product.price || 0
                                                )}
                                              </Td>
                                              <Td color="text-primary">
                                                <Badge
                                                  bg="success"
                                                  color="white"
                                                  size="sm">
                                                  {formatCurrency(
                                                    product.totalPrice || 0
                                                  )}
                                                </Badge>
                                              </Td>
                                            </Tr>
                                          )
                                        )}
                                      </Tbody>
                                    </Table>
                                  )}
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg="bg-card-status">
                  <CardHeader>
                    <Heading size="md">📝 بيانات الملف الخام</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box
                      bg="bg-input"
                      p={4}
                      borderRadius="md"
                      overflow="auto"
                      maxH="300px">
                      <Code
                        color="text-primary"
                        whiteSpace="pre"
                        display="block">
                        {JSON.stringify(jsonData, null, 2)}
                      </Code>
                    </Box>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              bg="bg-primary"
              color="white"
              _hover={{ bg: "primary.600" }}
              mr={3}
              onClick={onClose}>
              إغلاق
            </Button>
            <Button
              variant="outline"
              borderColor="border-primary"
              color="text-primary"
              _hover={{ bg: "bg-link" }}
              onClick={resetData}>
              مسح وعرض ملف جديد
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

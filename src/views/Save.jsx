import React, { useState, useEffect, useCallback } from "react";
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
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Code,
  Flex,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";
import {
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  DeleteIcon,
  StarIcon,
} from "@chakra-ui/icons";

export default function Save() {
  const [bansheeData, setBansheeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [salesTotal, setSalesTotal] = useState(0);
  const [statsData, setStatsData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchBansheeData = useCallback(() => {
    setIsLoading(true);
    const data = [];
    let totalSales = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("banshee")) {
        try {
          const value = localStorage.getItem(key);
          const parsedValue = value ? JSON.parse(value) : null;

          const itemData = {
            key,
            value: parsedValue,
            size: value ? value.length : 0,
            timestamp: new Date().toISOString(),
          };

          data.push(itemData);

          if (key === "banshee-sales" && parsedValue) {
            totalSales = calculateSalesTotal(parsedValue);
          }
        } catch (error) {
          console.error(`Error parsing key ${key}:`, error);
          data.push({
            key,
            value: null,
            error: "Failed to parse JSON",
            size: 0,
          });
        }
      }
    }

    // Load stats data
    const stats = localStorage.getItem("banshee-daily-stats");
    if (stats) {
      try {
        setStatsData(JSON.parse(stats));
      } catch (error) {
        console.error("Error parsing stats data:", error);
        setStatsData([]);
      }
    }

    setBansheeData(data);
    setSalesTotal(totalSales);
    setIsLoading(false);
  }, []);

  const calculateSalesTotal = (salesData) => {
    if (!salesData || typeof salesData !== "object") return 0;

    let total = 0;

    if (Array.isArray(salesData)) {
      salesData.forEach((sale) => {
        if (sale && typeof sale === "object") {
          if (sale.totalPrice) total += parseFloat(sale.totalPrice) || 0;
          if (sale.amount) total += parseFloat(sale.amount) || 0;
          if (sale.price) total += parseFloat(sale.price) || 0;
        }
      });
    } else {
      Object.keys(salesData).forEach((key) => {
        const item = salesData[key];
        if (item && typeof item === "object") {
          if (item.totalPrice) total += parseFloat(item.totalPrice) || 0;
          if (item.amount) total += parseFloat(item.amount) || 0;
          if (item.price) total += parseFloat(item.price) || 0;
        }
      });
    }

    return total;
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getArabicTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.toLocaleString("ar-SA", { month: "long" });
    const day = today.getDate();
    return `${day} ${month} ${year}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return {
      date: today.toISOString().split("T")[0], // YYYY-MM-DD
      arabicDate: getArabicTodayDate(),
      timestamp: today.toISOString(),
      dayOfWeek: today.toLocaleDateString("ar-SA", { weekday: "long" }),
    };
  };

  const resetAndSaveDailyStats = () => {
    if (
      window.confirm(
        "هل أنت متأكد من تصفير المبيعات وحفظ إحصائيات اليوم؟\n\n" +
          "سيتم:\n" +
          "1. حفظ إجمالي مبيعات اليوم في الإحصائيات\n" +
          "2. مسح جميع المبيعات الحالية\n" +
          "3. بدء يوم جديد\n\n" +
          "لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      // Calculate today's total
      const salesData = bansheeData.find(
        (item) => item.key === "banshee-sales"
      );
      const todayTotal = salesData ? calculateSalesTotal(salesData.value) : 0;

      if (todayTotal === 0) {
        alert("لا توجد مبيعات ليتم حفظها اليوم!");
        return;
      }

      // Get current date info
      const currentDate = getCurrentDate();

      // Create today's stats object
      const todayStats = {
        id: Date.now(),
        date: currentDate.date,
        arabicDate: currentDate.arabicDate,
        timestamp: currentDate.timestamp,
        dayOfWeek: currentDate.dayOfWeek,
        totalSales: todayTotal,
        salesCount:
          salesData && salesData.value
            ? Array.isArray(salesData.value)
              ? salesData.value.length
              : 0
            : 0,
        currency: "SAR",
      };

      // Load existing stats
      const existingStats = localStorage.getItem("banshee-daily-stats");
      let statsArray = [];

      if (existingStats) {
        try {
          statsArray = JSON.parse(existingStats);
        } catch (error) {
          console.error("Error parsing existing stats:", error);
        }
      }

      // Add today's stats
      statsArray.push(todayStats);

      // Save updated stats
      localStorage.setItem("banshee-daily-stats", JSON.stringify(statsArray));

      // Clear all sales data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("banshee-sales")) {
          localStorage.removeItem(key);
          i--;
        }
      }

      // Update state
      setStatsData(statsArray);
      setBansheeData([]);
      setSalesTotal(0);

      // Show success message
      alert(
        `✅ تم حفظ إحصائيات اليوم بنجاح!\n\n` +
          `التاريخ: ${currentDate.arabicDate}\n` +
          `إجمالي المبيعات: ${formatCurrency(todayTotal)}\n` +
          `عدد المعاملات: ${todayStats.salesCount}\n\n` +
          `تم تصفير المبيعات وبدء يوم جديد.`
      );

      // Refresh data
      fetchBansheeData();
    }
  };

  const exportToJsonFile = () => {
    setIsExporting(true);

    try {
      const salesData = bansheeData.find(
        (item) => item.key === "banshee-sales"
      );
      const currentSalesTotal = salesData
        ? calculateSalesTotal(salesData.value)
        : 0;

      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          arabicDate: getArabicTodayDate(),
          salesCount: bansheeData.length,
          totalSalesAmount: currentSalesTotal,
          currency: "SAR",
        },
        salesData: salesData ? salesData.value : null,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      setJsonContent(jsonString);

      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName = `مبيعات ابو رامي ${getTodayDate()}.json`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onOpen();
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
      });
  };

  const clearBansheeData = () => {
    if (
      window.confirm(
        "هل أنت متأكد من مسح جميع بيانات المبيعات؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("banshee-sales")) {
          localStorage.removeItem(key);
          i--;
        }
      }

      setBansheeData([]);
      setSalesTotal(0);
    }
  };

  const clearStatsData = () => {
    if (
      window.confirm(
        "هل أنت متأكد من مسح جميع الإحصائيات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      localStorage.removeItem("banshee-daily-stats");
      setStatsData([]);
      alert("تم مسح جميع الإحصائيات المحفوظة.");
    }
  };

  useEffect(() => {
    fetchBansheeData();
  }, [fetchBansheeData]);

  const stats = {
    salesCount: bansheeData.length,
    totalSize: bansheeData.reduce((sum, item) => sum + item.size, 0),
    salesTotal: salesTotal,
    dailyStatsCount: statsData.length,
    totalAllTimeSales: statsData.reduce(
      (sum, stat) => sum + (stat.totalSales || 0),
      0
    ),
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 بايت";
    const k = 1024;
    const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount);
  };

  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Card bg="bg-card" borderColor="border-primary">
          <CardHeader>
            <Heading size="lg" textAlign="center" color="text-primary">
              💾 نظام حفظ وإحصائيات المبيعات
            </Heading>
            <Text textAlign="center" color="text-secondary" mt={2}>
              حفظ واستعادة بيانات المبيعات مع تتبع الإحصائيات اليومية
            </Text>
          </CardHeader>
        </Card>

        <Card bg="bg-card" borderColor="border-primary">
          <CardBody>
            <Flex justify="space-around" wrap="wrap" gap={4}>
              <VStack spacing={1}>
                <Badge
                  bg="bg-card-status"
                  color="text-primary"
                  fontSize="lg"
                  p={2}>
                  {stats.salesCount}
                </Badge>
                <Text fontSize="sm" color="text-secondary">
                  مبيعات اليوم
                </Text>
              </VStack>

              <VStack spacing={1}>
                <Badge
                  bg="bg-card-status"
                  color="text-primary"
                  fontSize="lg"
                  p={2}>
                  {stats.dailyStatsCount}
                </Badge>
                <Text fontSize="sm" color="text-secondary">
                  أيام مسجلة
                </Text>
              </VStack>

              <VStack spacing={1}>
                <Badge bg="success" color="white" fontSize="lg" p={2}>
                  {formatCurrency(stats.salesTotal)}
                </Badge>
                <Text fontSize="sm" color="text-secondary">
                  إجمالي اليوم
                </Text>
              </VStack>

              <VStack spacing={1}>
                <Badge bg="purple" color="white" fontSize="lg" p={2}>
                  {formatCurrency(stats.totalAllTimeSales)}
                </Badge>
                <Text fontSize="sm" color="text-secondary">
                  الإجمالي الكلي
                </Text>
              </VStack>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="bg-card" borderColor="border-primary">
          <CardBody>
            <Flex justify="center" gap={4} wrap="wrap">
              <Button
                bg="bg-primary"
                color="white"
                _hover={{ bg: "primary.600" }}
                leftIcon={<DownloadIcon />}
                onClick={fetchBansheeData}
                isLoading={isLoading}
                loadingText="جاري التحميل...">
                تحديث البيانات
              </Button>

              <Button
                bg="warning"
                color="white"
                _hover={{ bg: "orange.600" }}
                leftIcon={<StarIcon />}
                onClick={resetAndSaveDailyStats}
                isDisabled={bansheeData.length === 0}>
                حفظ إحصائيات اليوم
              </Button>

              <Button
                bg="success"
                color="white"
                _hover={{ bg: "#2bb346ff" }}
                leftIcon={<DownloadIcon />}
                onClick={exportToJsonFile}
                isLoading={isExporting}
                loadingText="جاري التصدير..."
                isDisabled={bansheeData.length === 0}>
                تصدير ملف المبيعات
              </Button>

              <Button
                bg="error"
                color="white"
                _hover={{ bg: "red.600" }}
                leftIcon={<DeleteIcon />}
                onClick={clearBansheeData}
                isDisabled={bansheeData.length === 0}>
                مسح مبيعات اليوم
              </Button>
            </Flex>

            {isExporting && (
              <Box mt={4}>
                <Progress size="sm" isIndeterminate colorScheme="green" />
                <Text
                  textAlign="center"
                  mt={2}
                  fontSize="sm"
                  color="text-secondary">
                  جاري تجهيز ملف "مبيعات ابو رامي"...
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Daily Stats Section */}
        {statsData.length > 0 && (
          <Card bg="bg-card" borderColor="border-primary">
            <CardHeader>
              <Heading size="md" color="text-primary">
                📊 الإحصائيات المحفوظة
              </Heading>
              <Text fontSize="sm" color="text-secondary" mt={2}>
                إحصائيات المبيعات للأيام السابقة
              </Text>
            </CardHeader>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg="bg-card-status">
                      <Th color="text-primary">التاريخ</Th>
                      <Th color="text-primary">اليوم</Th>
                      <Th color="text-primary">عدد المبيعات</Th>
                      <Th color="text-primary">الإجمالي</Th>
                      <Th color="text-primary">الإجراءات</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {statsData
                      .slice()
                      .reverse()
                      .map((stat, index) => (
                        <Tr key={stat.id} _hover={{ bg: "bg-link" }}>
                          <Td color="text-primary">
                            {stat.arabicDate || formatDateForDisplay(stat.date)}
                          </Td>
                          <Td color="text-primary">
                            <Badge bg="purple" color="white">
                              {stat.dayOfWeek || "غير محدد"}
                            </Badge>
                          </Td>
                          <Td color="text-primary">{stat.salesCount || 0}</Td>
                          <Td color="text-primary">
                            <Badge bg="success" color="white">
                              {formatCurrency(stat.totalSales || 0)}
                            </Badge>
                          </Td>
                          <Td>
                            <Button
                              size="xs"
                              variant="outline"
                              colorScheme="red"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `هل تريد حذف إحصائيات ${stat.arabicDate}؟`
                                  )
                                ) {
                                  const updatedStats = statsData.filter(
                                    (s) => s.id !== stat.id
                                  );
                                  localStorage.setItem(
                                    "banshee-daily-stats",
                                    JSON.stringify(updatedStats)
                                  );
                                  setStatsData(updatedStats);
                                }
                              }}>
                              حذف
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
              <Flex justify="flex-end" mt={4}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  onClick={clearStatsData}>
                  مسح جميع الإحصائيات
                </Button>
              </Flex>
            </CardBody>
          </Card>
        )}

        {/* Current Sales Data */}
        {bansheeData.length > 0 ? (
          <Card bg="bg-card" borderColor="border-primary">
            <CardHeader>
              <Heading size="md" color="text-primary">
                📋 قائمة بيانات المبيعات الحالية
              </Heading>
              <Text fontSize="sm" color="text-secondary" mt={2}>
                مبيعات اليوم الحالي
              </Text>
            </CardHeader>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg="bg-card-status">
                      <Th color="text-primary">المفتاح</Th>
                      <Th color="text-primary">النوع</Th>
                      <Th color="text-primary">الحجم</Th>
                      <Th color="text-primary">العناصر</Th>
                      <Th color="text-primary">الحالة</Th>
                      <Th color="text-primary">القيمة</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {bansheeData.map((item, index) => (
                      <Tr key={index} _hover={{ bg: "bg-link" }}>
                        <Td>
                          <Code
                            bg="bg-input"
                            color="text-primary"
                            p={1}
                            borderRadius="md">
                            {item.key}
                          </Code>
                        </Td>
                        <Td>
                          <Badge bg="purple" color="white">
                            {Array.isArray(item.value)
                              ? "مصفوفة"
                              : typeof item.value}
                          </Badge>
                        </Td>
                        <Td color="text-primary">
                          {formatFileSize(item.size)}
                        </Td>
                        <Td color="text-primary">
                          {Array.isArray(item.value)
                            ? `${item.value.length} عنصر`
                            : item.value && typeof item.value === "object"
                            ? `${Object.keys(item.value).length} خاصية`
                            : "1"}
                        </Td>
                        <Td>
                          {item.error ? (
                            <Badge bg="error" color="white">
                              خطأ
                            </Badge>
                          ) : (
                            <Badge bg="success" color="white">
                              صالح
                            </Badge>
                          )}
                        </Td>
                        <Td>
                          <Badge bg="warning" color="white">
                            {formatCurrency(calculateSalesTotal(item.value))}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        ) : (
          <Alert status="info" borderRadius="lg" bg="info" color="white">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>لا توجد مبيعات اليوم!</AlertTitle>
              <AlertDescription>
                لم يتم العثور على أي بيانات للمبيعات اليوم في localStorage.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Card bg="bg-card" borderColor="border-primary">
          <CardHeader>
            <Heading size="md" color="text-primary">
              💡 معلومات هامة
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Text color="text-primary">
                ✅ <strong>حفظ إحصائيات اليوم:</strong> احفظ إجمالي مبيعات اليوم
                واصفر للمبيعات.
              </Text>
              <Text color="text-primary">
                ✅ <strong>التتبع التاريخي:</strong> يتم حفظ إحصائيات كل يوم
                لتحليل الأداء.
              </Text>
              <Text color="text-primary">
                ✅ <strong>النسخ الاحتياطي:</strong> يتم حفظ الملف باسم "مبيعات
                ابو رامي" مع التاريخ.
              </Text>
              <Text color="text-primary">
                📅 <strong>التاريخ الحالي:</strong> {getArabicTodayDate()}
              </Text>
              <Text color="text-primary">
                📊 <strong>إحصائيات:</strong> {stats.dailyStatsCount} يوم مسجل،
                الإجمالي الكلي: {formatCurrency(stats.totalAllTimeSales)}
              </Text>
              <Text color="text-primary">
                ⚠️ <strong>تحذير:</strong> لا تشارك ملفات JSON التي تحتوي على
                بيانات حساسة.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* JSON Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          bg="bg-card"
          color="text-primary"
          borderColor="border-primary">
          <ModalHeader>📄 محتوى ملف JSON</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="sm" color="text-secondary">
                تم حفظ الملف باسم: "مبيعات ابو رامي {getTodayDate()}.json"
              </Text>
              <Box position="relative" w="100%">
                <Textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  fontFamily="monospace"
                  fontSize="xs"
                  h="400px"
                  bg="bg-input"
                  color="text-primary"
                  borderColor="border-primary"
                  readOnly
                  _focus={{ borderColor: "border-secondary" }}
                />
                <Tooltip label={copied ? "تم النسخ!" : "نسخ إلى الحافظة"}>
                  <IconButton
                    icon={copied ? <CheckIcon /> : <CopyIcon />}
                    bg={copied ? "success" : "bg-primary"}
                    color="white"
                    _hover={{ bg: copied ? "#2bb346ff" : "primary.600" }}
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={copyToClipboard}
                    aria-label="نسخ JSON"
                  />
                </Tooltip>
              </Box>
            </VStack>
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
              onClick={copyToClipboard}>
              نسخ إلى الحافظة
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

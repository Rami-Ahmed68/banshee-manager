import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
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
  useToast,
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
} from "@chakra-ui/icons";

export default function Save() {
  const [bansheeData, setBansheeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // جلب جميع بيانات banshee من localStorage
  const fetchBansheeData = () => {
    setIsLoading(true);
    const data = [];

    // الحصول على جميع المفاتيح من localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // التحقق إذا كان المفتاح يبدأ بـ "banshee"
      if (key && key.startsWith("banshee")) {
        try {
          const value = localStorage.getItem(key);
          const parsedValue = value ? JSON.parse(value) : null;

          data.push({
            key,
            value: parsedValue,
            size: value ? value.length : 0,
            timestamp: new Date().toISOString(),
          });
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

    setBansheeData(data);
    setIsLoading(false);

    // إظهار إشعار بنتيجة الجلب
    if (data.length > 0) {
      toast({
        title: "تم جلب البيانات",
        description: `تم العثور على ${data.length} عنصر من البيانات`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "لا توجد بيانات",
        description: 'لم يتم العثور على أي بيانات تبدأ بـ "banshee"',
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // تصدير البيانات كملف JSON
  const exportToJsonFile = () => {
    setIsExporting(true);

    try {
      // إنشاء كائن يحتوي على جميع البيانات
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalItems: bansheeData.length,
          totalSize: bansheeData.reduce((sum, item) => sum + item.size, 0),
        },
        data: bansheeData.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {}),
      };

      // تحويل إلى JSON مع تنسيق
      const jsonString = JSON.stringify(exportData, null, 2);
      setJsonContent(jsonString);

      // إنشاء ملف للتنزيل
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `banshee-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // فتح النافذة المنبثقة لعرض JSON
      onOpen();

      toast({
        title: "تم التصدير بنجاح",
        description: "تم حفظ جميع البيانات في ملف JSON",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // نسخ JSON إلى الحافظة
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonContent)
      .then(() => {
        setCopied(true);
        toast({
          title: "تم النسخ",
          description: "تم نسخ JSON إلى الحافظة",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
        toast({
          title: "خطأ في النسخ",
          description: "تعذر نسخ JSON",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // مسح جميع بيانات banshee
  const clearBansheeData = () => {
    if (
      window.confirm(
        "هل أنت متأكد من مسح جميع بيانات banshee؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      let clearedCount = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("banshee")) {
          localStorage.removeItem(key);
          clearedCount++;
          i--; // لأن localStorage.length يتغير بعد الحذف
        }
      }

      setBansheeData([]);

      toast({
        title: "تم المسح",
        description: `تم حذف ${clearedCount} عنصر من البيانات`,
        status: clearedCount > 0 ? "warning" : "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // تحميل البيانات عند أول عرض للمكون
  useEffect(() => {
    fetchBansheeData();
  }, []);

  // حساب الإحصائيات
  const stats = {
    totalItems: bansheeData.length,
    totalSize: bansheeData.reduce((sum, item) => sum + item.size, 0),
    uniqueKeys: [...new Set(bansheeData.map((item) => item.key))].length,
  };

  // تنسيق حجم الملف
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 بايت";
    const k = 1024;
    const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* العنوان الرئيسي */}
        <Card bg="gray.800" color="white">
          <CardHeader>
            <Heading size="lg" textAlign="center">
              💾 نظام حفظ بيانات banshee
            </Heading>
            <Text textAlign="center" color="gray.300" mt={2}>
              حفظ واستعادة جميع البيانات المحفوظة في localStorage التي تبدأ بـ
              "banshee"
            </Text>
          </CardHeader>
        </Card>

        {/* بطاقة الإحصائيات */}
        <Card bg="blue.900" color="white">
          <CardBody>
            <Flex justify="space-around" wrap="wrap" gap={4}>
              <VStack spacing={1}>
                <Badge colorScheme="purple" fontSize="lg" p={2}>
                  {stats.totalItems}
                </Badge>
                <Text fontSize="sm">إجمالي العناصر</Text>
              </VStack>

              <VStack spacing={1}>
                <Badge colorScheme="green" fontSize="lg" p={2}>
                  {formatFileSize(stats.totalSize)}
                </Badge>
                <Text fontSize="sm">الحجم الكلي</Text>
              </VStack>

              <VStack spacing={1}>
                <Badge colorScheme="orange" fontSize="lg" p={2}>
                  {stats.uniqueKeys}
                </Badge>
                <Text fontSize="sm">مفاتيح فريدة</Text>
              </VStack>
            </Flex>
          </CardBody>
        </Card>

        {/* أزرار التحكم */}
        <Card bg="gray.800" color="white">
          <CardBody>
            <Flex justify="center" gap={4} wrap="wrap">
              <Button
                colorScheme="blue"
                leftIcon={<DownloadIcon />}
                onClick={fetchBansheeData}
                isLoading={isLoading}
                loadingText="جاري التحميل...">
                تحديث البيانات
              </Button>

              <Button
                colorScheme="green"
                leftIcon={<DownloadIcon />}
                onClick={exportToJsonFile}
                isLoading={isExporting}
                loadingText="جاري التصدير..."
                isDisabled={bansheeData.length === 0}>
                تصدير إلى JSON
              </Button>

              <Button
                colorScheme="red"
                leftIcon={<DeleteIcon />}
                onClick={clearBansheeData}
                isDisabled={bansheeData.length === 0}>
                مسح الكل
              </Button>
            </Flex>

            {isExporting && (
              <Box mt={4}>
                <Progress size="sm" isIndeterminate colorScheme="green" />
                <Text textAlign="center" mt={2} fontSize="sm">
                  جاري تجهيز ملف JSON...
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* جدول البيانات */}
        {bansheeData.length > 0 ? (
          <Card bg="gray.800" color="white">
            <CardHeader>
              <Heading size="md">📋 قائمة بيانات banshee</Heading>
            </CardHeader>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg="gray.700">
                      <Th color="white">المفتاح</Th>
                      <Th color="white">النوع</Th>
                      <Th color="white">الحجم</Th>
                      <Th color="white">العناصر</Th>
                      <Th color="white">الحالة</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {bansheeData.map((item, index) => (
                      <Tr key={index} _hover={{ bg: "gray.700" }}>
                        <Td>
                          <Code colorScheme="green" p={1} borderRadius="md">
                            {item.key}
                          </Code>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue">
                            {Array.isArray(item.value)
                              ? "مصفوفة"
                              : typeof item.value}
                          </Badge>
                        </Td>
                        <Td>{formatFileSize(item.size)}</Td>
                        <Td>
                          {Array.isArray(item.value)
                            ? `${item.value.length} عنصر`
                            : item.value && typeof item.value === "object"
                            ? `${Object.keys(item.value).length} خاصية`
                            : "1"}
                        </Td>
                        <Td>
                          {item.error ? (
                            <Badge colorScheme="red">خطأ</Badge>
                          ) : (
                            <Badge colorScheme="green">صالح</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        ) : (
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>لا توجد بيانات!</AlertTitle>
              <AlertDescription>
                لم يتم العثور على أي بيانات في localStorage تبدأ بـ "banshee".
                قم بإنشاء بعض البيانات أولاً، ثم عد إلى هذه الصفحة.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* نصائح واستخدامات */}
        <Card bg="gray.800" color="white">
          <CardHeader>
            <Heading size="md">💡 نصائح واستخدامات</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Text>
                ✅ <strong>النسخ الاحتياطي:</strong> قم بتصدير البيانات بانتظام
                لحفظ نسخة احتياطية.
              </Text>
              <Text>
                ✅ <strong>التنقل بين الأجهزة:</strong> يمكنك تصدير البيانات
                واستيرادها على جهاز آخر.
              </Text>
              <Text>
                ✅ <strong>استعادة البيانات:</strong> احفظ ملف JSON في مكان آمن
                لاستعادة البيانات عند الحاجة.
              </Text>
              <Text>
                ⚠️ <strong>تحذير:</strong> لا تشارك ملفات JSON التي تحتوي على
                بيانات حساسة.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* نافذة عرض JSON */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>📄 محتوى ملف JSON</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.300">
                يمكنك نسخ هذا المحتوى أو حفظه في ملف
              </Text>
              <Box position="relative" w="100%">
                <Textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  fontFamily="monospace"
                  fontSize="xs"
                  h="400px"
                  bg="gray.900"
                  color="green.300"
                  borderColor="gray.600"
                  readOnly
                  _focus={{ borderColor: "gray.500" }}
                />
                <Tooltip label={copied ? "تم النسخ!" : "نسخ إلى الحافظة"}>
                  <IconButton
                    icon={copied ? <CheckIcon /> : <CopyIcon />}
                    colorScheme={copied ? "green" : "blue"}
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              إغلاق
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              onClick={copyToClipboard}>
              نسخ إلى الحافظة
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

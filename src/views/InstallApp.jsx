import React, { useState, useEffect } from "react";
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
  List,
  ListItem,
  ListIcon,
  Flex,
  Badge,
  Icon,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  DownloadIcon,
  PhoneIcon,
  InfoIcon,
  WarningIcon,
  TimeIcon,
  ViewIcon,
  StarIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installationStep, setInstallationStep] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Debug information
    let debugText = `User Agent: ${navigator.userAgent}\n`;

    // Check if app is already installed
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    setIsStandalone(isInStandaloneMode);
    debugText += `Standalone mode: ${isInStandaloneMode}\n`;

    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const ios = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const android = /android/i.test(userAgent);
    setIsIOS(ios);
    setIsAndroid(android);
    debugText += `iOS: ${ios}, Android: ${android}\n`;

    // Check PWA requirements
    debugText += `HTTPS: ${window.location.protocol === "https:"}\n`;
    debugText += `localhost: ${window.location.hostname === "localhost"}\n`;
    debugText += `BeforeInstallPrompt supported: ${
      "beforeinstallprompt" in window
    }\n`;

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      debugText += "BeforeInstallPrompt event fired!\n";
      setDebugInfo(debugText);
    };

    // Check if app is already installed (iOS specific)
    if (window.navigator.standalone) {
      setIsStandalone(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    setDebugInfo(debugText);
    console.log("Debug Info:", debugText);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
        setIsInstallable(false);
        setInstallationStep(1);
        setTimeout(() => setInstallationStep(2), 2000);
      } else {
        console.log("User dismissed the install prompt");
      }

      setDeferredPrompt(null);
    } else {
      onOpen();
    }
  };

  const getInstallationSteps = () => {
    if (isIOS) {
      return [
        "افتح موقعنا في متصفح Safari",
        "انقر على زر المشاركة (مربع مع سهم للأعلى)",
        "انزل للأسفل وانقر على 'أضف إلى الشاشة الرئيسية'",
        "انقر على 'إضافة' في الزاوية العلوية اليمنى",
        "سيظهر التطبيق على شاشتك الرئيسية",
      ];
    } else if (isAndroid) {
      return [
        "افتح موقعنا في متصفح Chrome",
        "انقر على قائمة النقاط الثلاث في الأعلى",
        "اختر 'تثبيت التطبيق' أو 'Add to Home Screen'",
        "انقر على 'تثبيت' أو 'Install'",
        "سيظهر التطبيق على شاشتك الرئيسية",
      ];
    } else {
      return [
        "انقر على زر 'تثبيت التطبيق' في أعلى الصفحة",
        "اتبع التعليمات التي تظهر في المتصفح",
        "انقر على 'تثبيت' أو 'Install'",
        "انتظر اكتمال التثبيت",
        "سيظهر التطبيق على شاشتك الرئيسية أو قائمة التطبيقات",
      ];
    }
  };

  const getBrowserInstructions = () => {
    return [
      {
        name: "Chrome",
        color: "#4285F4",
        steps: ["القائمة → تثبيت التطبيق", "تثبيت"],
      },
      {
        name: "Firefox",
        color: "#FF7139",
        steps: ["القائمة → تثبيت", "إضافة"],
      },
      {
        name: "Safari",
        color: "#000000",
        steps: ["شارك → أضف إلى الشاشة الرئيسية", "إضافة"],
      },
      {
        name: "Edge",
        color: "#0078D4",
        steps: ["القائمة → تثبيت", "تثبيت"],
      },
    ];
  };

  const getInstallButtonText = () => {
    if (isStandalone) {
      return "التطبيق مثبت بالفعل ✅";
    } else if (isInstallable) {
      return "تثبيت التطبيق 📱 (PWA متاح)";
    } else if (isIOS) {
      return "إضافة إلى الشاشة الرئيسية (iOS)";
    } else if (isAndroid) {
      return "إضافة إلى الشاشة الرئيسية (Android)";
    } else {
      return "تعليمات إضافة التطبيق";
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Card bg="bg-card" borderColor="border-primary">
          <CardHeader>
            <Heading size="lg" textAlign="center" color="text-primary">
              📲 تثبيت تطبيق المبيعات
            </Heading>
            <Text textAlign="center" color="text-secondary" mt={2}>
              قم بتثبيت التطبيق على جهازك للوصول السريع والعمل بدون إنترنت
            </Text>
          </CardHeader>
        </Card>

        <Card bg="bg-card" borderColor="border-primary">
          <CardBody>
            <VStack spacing={6}>
              {isStandalone ? (
                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>التطبيق مثبت بنجاح! 🎉</AlertTitle>
                    <AlertDescription>
                      يمكنك استخدام تطبيق المبيعات مباشرة من شاشتك الرئيسية
                    </AlertDescription>
                  </Box>
                </Alert>
              ) : isInstallable ? (
                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>التطبيق جاهز للتثبيت! ✅</AlertTitle>
                    <AlertDescription>
                      يمكنك تثبيت التطبيق الآن على جهازك
                    </AlertDescription>
                  </Box>
                </Alert>
              ) : (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>أضف التطبيق إلى جهازك</AlertTitle>
                    <AlertDescription>
                      استمتع بتجربة أسرع ووظائف إضافية عند إضافة التطبيق على
                      جهازك
                    </AlertDescription>
                  </Box>
                </Alert>
              )}

              <Flex
                direction={{ base: "column", md: "row" }}
                gap={6}
                width="100%">
                <Card bg="bg-card-status" flex={1}>
                  <CardBody>
                    <VStack spacing={4}>
                      <Icon as={PhoneIcon} boxSize={12} color="bg-primary" />
                      <Heading size="md" color="text-primary">
                        مزايا الإضافة
                      </Heading>
                      <List spacing={3}>
                        <ListItem color="text-primary">
                          <ListIcon as={CheckCircleIcon} color="success" />
                          وصول سريع من الشاشة الرئيسية
                        </ListItem>
                        <ListItem color="text-primary">
                          <ListIcon as={CheckCircleIcon} color="success" />
                          عمل بدون إنترنت
                        </ListItem>
                        <ListItem color="text-primary">
                          <ListIcon as={ViewIcon} color="success" />
                          إشعارات مباشرة
                        </ListItem>
                        <ListItem color="text-primary">
                          <ListIcon as={StarIcon} color="success" />
                          تجربة تطبيق أصلي
                        </ListItem>
                        <ListItem color="text-primary">
                          <ListIcon as={SettingsIcon} color="success" />
                          تحديثات تلقائية
                        </ListItem>
                      </List>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg="bg-card-status" flex={1}>
                  <CardBody>
                    <VStack spacing={4}>
                      <Icon as={TimeIcon} boxSize={12} color="purple" />
                      <Heading size="md" color="text-primary">
                        دعم المنصات
                      </Heading>
                      <Flex wrap="wrap" gap={4} justify="center">
                        <VStack>
                          <Box
                            width="50px"
                            height="50px"
                            bg="#3DDC84"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Text color="white" fontWeight="bold">
                              A
                            </Text>
                          </Box>
                          <Text fontSize="sm" color="text-secondary">
                            Android
                          </Text>
                        </VStack>
                        <VStack>
                          <Box
                            width="50px"
                            height="50px"
                            bg="#000000"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Text color="white" fontWeight="bold">
                              i
                            </Text>
                          </Box>
                          <Text fontSize="sm" color="text-secondary">
                            iOS
                          </Text>
                        </VStack>
                        <VStack>
                          <Box
                            width="50px"
                            height="50px"
                            bg="#0078D4"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Text color="white" fontWeight="bold">
                              W
                            </Text>
                          </Box>
                          <Text fontSize="sm" color="text-secondary">
                            Windows
                          </Text>
                        </VStack>
                        <VStack>
                          <Box
                            width="50px"
                            height="50px"
                            bg="#4285F4"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Text color="white" fontWeight="bold">
                              C
                            </Text>
                          </Box>
                          <Text fontSize="sm" color="text-secondary">
                            Chrome
                          </Text>
                        </VStack>
                      </Flex>
                      <Text fontSize="sm" color="text-muted" textAlign="center">
                        يدعم جميع المتصفحات الحديثة
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </Flex>

              <VStack spacing={4} width="100%">
                <Button
                  bg={
                    isStandalone
                      ? "success"
                      : isInstallable
                      ? "purple"
                      : "bg-primary"
                  }
                  color="white"
                  _hover={{
                    bg: isStandalone
                      ? "#2bb346ff"
                      : isInstallable
                      ? "#7810cdff"
                      : "primary.600",
                    transform: "scale(1.05)",
                  }}
                  leftIcon={<DownloadIcon />}
                  onClick={handleInstallClick}
                  size="lg"
                  px={10}
                  py={6}
                  fontSize="lg"
                  isDisabled={isStandalone}
                  transition="all 0.3s">
                  {getInstallButtonText()}
                </Button>

                {installationStep > 0 && (
                  <Box width="100%" mt={4}>
                    <Progress
                      value={installationStep === 1 ? 50 : 100}
                      colorScheme="green"
                      size="lg"
                      borderRadius="full"
                    />
                    <Text textAlign="center" mt={2} color="text-secondary">
                      {installationStep === 1
                        ? "جاري التثبيت..."
                        : "تم التثبيت بنجاح! ✅"}
                    </Text>
                  </Box>
                )}

                {/* Debug Info (يمكن إخفاؤها لاحقاً) */}
                <details style={{ width: "100%", marginTop: "20px" }}>
                  <summary style={{ cursor: "pointer", color: "#666" }}>
                    معلومات التصحيح (للإظهار فقط)
                  </summary>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: "10px",
                      borderRadius: "5px",
                      fontSize: "12px",
                      overflow: "auto",
                      whiteSpace: "pre-wrap",
                      color: "#333",
                    }}>
                    {debugInfo}
                  </pre>
                </details>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="bg-card" borderColor="border-primary">
          <CardHeader>
            <Heading size="md" color="text-primary">
              📋 تعليمات الإضافة حسب المتصفح
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              {getBrowserInstructions().map((browser, index) => (
                <Card key={index} bg="bg-card-status" width="100%">
                  <CardBody>
                    <Flex align="center" gap={4}>
                      <Box
                        width="40px"
                        height="40px"
                        bg={browser.color}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        <Text color="white" fontWeight="bold">
                          {browser.name.charAt(0)}
                        </Text>
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="bold" color="text-primary">
                          {browser.name}
                        </Text>
                        <Text fontSize="sm" color="text-secondary">
                          {browser.steps.join(" → ")}
                        </Text>
                      </Box>
                      <Badge
                        bg={
                          isIOS && browser.name === "Safari"
                            ? "purple"
                            : "bg-card"
                        }
                        color={
                          isIOS && browser.name === "Safari"
                            ? "white"
                            : "text-primary"
                        }>
                        {isIOS && browser.name === "Safari"
                          ? "مستحسن"
                          : "مدعوم"}
                      </Badge>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card bg="bg-card" borderColor="border-primary">
          <CardHeader>
            <Heading size="md" color="text-primary">
              ❓ الأسئلة الشائعة
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="bold" color="text-primary" mb={2}>
                  كيف أضيف التطبيق؟
                </Text>
                <Text color="text-secondary">
                  اضغط على الزر أعلاه واتبع التعليمات حسب متصفحك وجهازك.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="text-primary" mb={2}>
                  هل يعمل بدون إنترنت؟
                </Text>
                <Text color="text-secondary">
                  نعم، بعد الإضافة يمكنك إدارة المبيعات بدون اتصال بالإنترنت.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="text-primary" mb={2}>
                  هل بياناتي آمنة؟
                </Text>
                <Text color="text-secondary">
                  نعم، جميع البيانات محفوظة محلياً على جهازك.
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="text-primary" mb={2}>
                  كيف أتأكد من نجاح الإضافة؟
                </Text>
                <Text color="text-secondary">
                  سترى أيقونة التطبيق على شاشتك الرئيسية مع اسم "مبيعات أبو
                  رامي".
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          bg="bg-card"
          color="text-primary"
          borderColor="border-primary">
          <ModalHeader>
            <Heading size="lg">📱 تعليمات الإضافة</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Alert status="warning" borderRadius="lg">
                <AlertIcon as={WarningIcon} />
                <Text>
                  {isIOS
                    ? "لإضافة التطبيق على iOS، يجب استخدام متصفح Safari"
                    : "اتبع الخطوات التالية لإضافة التطبيق على جهازك"}
                </Text>
              </Alert>

              <List spacing={4}>
                {getInstallationSteps().map((step, index) => (
                  <ListItem key={index} color="text-primary">
                    <Flex align="start" gap={3}>
                      <Badge
                        bg="bg-primary"
                        color="white"
                        minW="30px"
                        height="30px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full">
                        {index + 1}
                      </Badge>
                      <Text flex={1}>{step}</Text>
                    </Flex>
                  </ListItem>
                ))}
              </List>

              {isIOS && (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon as={InfoIcon} />
                  <Text>
                    <strong>ملاحظة هامة:</strong> تأكد من فتح الموقع في متصفح
                    Safari وليس Chrome أو Firefox
                  </Text>
                </Alert>
              )}

              <Card bg="bg-card-status">
                <CardBody>
                  <VStack spacing={2}>
                    <Text fontWeight="bold" color="text-primary">
                      بعد الإضافة:
                    </Text>
                    <Text color="text-secondary">
                      - ابحث عن أيقونة "مبيعات أبو رامي" على شاشتك الرئيسية
                    </Text>
                    <Text color="text-secondary">
                      - يمكنك فتح التطبيق مباشرة من هناك
                    </Text>
                    <Text color="text-secondary">
                      - البيانات ستكون متاحة بدون إنترنت
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              bg="bg-primary"
              color="white"
              _hover={{ bg: "primary.600" }}
              mr={3}
              onClick={onClose}>
              فهمت
            </Button>
            <Button
              variant="outline"
              borderColor="border-primary"
              color="text-primary"
              _hover={{ bg: "bg-link" }}
              onClick={() => window.location.reload()}>
              تحديث الصفحة
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

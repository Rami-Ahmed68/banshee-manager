// src/views/GraphicalAnalysis.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Select,
  Flex,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GraphicalAnalysis = ({ sales = [] }) => {
  const [chartType, setChartType] = useState("line"); // line, area, bar
  const [timeRange, setTimeRange] = useState("7days"); // 7days, 30days, all
  const [localStorageData, setLocalStorageData] = useState([]);

  // جلب البيانات من localStorage عند تحميل المكون
  useEffect(() => {
    const loadLocalStorageData = () => {
      try {
        const savedData = localStorage.getItem("banshee-ana");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setLocalStorageData(parsedData);
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };

    loadLocalStorageData();
  }, []);

  // توليد بيانات تجريبية واقعية
  const generateDemoData = (days = 7) => {
    const demoData = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      // نمط واقعي مع تقلبات
      const baseAmount = 3000;
      const fluctuation = Math.sin(i * 0.5) * 1500; // موجة جيبية
      const randomNoise = Math.random() * 1000 - 500; // ضوضاء عشوائية

      const amount = Math.max(500, baseAmount + fluctuation + randomNoise);
      const orders = Math.max(
        1,
        Math.floor(amount / 300) + Math.floor(Math.random() * 5)
      );

      demoData.push({
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("ar-SA", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        fullDate: date.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        amount: Math.round(amount),
        orders: orders,
        average: Math.round(amount / orders),
        isDemo: true,
      });
    }

    return demoData;
  };

  // تحويل البيانات من localStorage إلى التنسيق المطلوب
  const transformLocalStorageData = (lsData, days = 7) => {
    if (!lsData || lsData.length === 0) return [];

    const transformedData = lsData.slice(0, days).map((item) => {
      const date = new Date(item.date);
      return {
        date: item.date,
        day: date.toLocaleDateString("ar-SA", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        fullDate: date.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        amount: item.totalRevenue,
        orders: item.salesCount,
        average:
          item.salesCount > 0
            ? Math.round(item.totalRevenue / item.salesCount)
            : 0,
        isDemo: false,
        isLocalStorage: true,
        dayName: item.dayName,
      };
    });

    return transformedData;
  };

  // تحضير البيانات للرسم البياني
  const chartData = useMemo(() => {
    // تحديد عدد الأيام حسب النطاق الزمني
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;

    // إذا كان هناك مبيعات حقيقية من الـ props، استخدمها
    if (sales && sales.length > 0) {
      const dailySales = {};
      const oneDay = 24 * 60 * 60 * 1000;
      const startDate = new Date(Date.now() - (days - 1) * oneDay);

      // تهيئة جميع الأيام في النطاق
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * oneDay);
        const dayKey = date.toISOString().split("T")[0];
        dailySales[dayKey] = {
          date: dayKey,
          day: date.toLocaleDateString("ar-SA", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          fullDate: date.toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          amount: 0,
          orders: 0,
          average: 0,
          isDemo: false,
        };
      }

      // جمع البيانات الحقيقية
      sales.forEach((sale) => {
        const date = new Date(sale.createdAt || sale.created_at);
        const dayKey = date.toISOString().split("T")[0];

        if (dailySales[dayKey]) {
          dailySales[dayKey].amount += sale.totalPrice || 0;
          dailySales[dayKey].orders += 1;
        }
      });

      // حساب المتوسط
      Object.values(dailySales).forEach((day) => {
        day.average = day.orders > 0 ? Math.round(day.amount / day.orders) : 0;
      });

      const result = Object.values(dailySales).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      return result.length > 0 ? result : generateDemoData(days);
    }

    // إذا كانت هناك بيانات في localStorage، استخدمها
    if (localStorageData && localStorageData.length > 0) {
      const transformedData = transformLocalStorageData(localStorageData, days);
      if (transformedData.length > 0) {
        return transformedData;
      }
    }

    // إذا لم تكن هناك بيانات، استخدم البيانات التجريبية
    return generateDemoData(days);
  }, [sales, timeRange, localStorageData]);

  // تنسيق العملة
  const formatCurrency = (value) => {
    return value?.toLocaleString("ar-SA") || "0";
  };

  // تلميح مخصص للرسم البياني
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <Box
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.200"
          maxW="300px">
          <Text fontWeight="bold" color="gray.800" mb={2}>
            {data.fullDate || label}
          </Text>
          {data.dayName && (
            <Text color="gray.600" fontSize="sm" mb={2}>
              📅 {data.dayName}
            </Text>
          )}
          {payload.map((entry, index) => (
            <Box key={index} mb={1}>
              <HStack>
                <Box
                  w="12px"
                  h="12px"
                  borderRadius="sm"
                  bg={entry.color}
                  mr={2}
                />
                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                  {entry.name}:
                </Text>
                <Text fontSize="sm" color="gray.800" fontWeight="bold">
                  {entry.dataKey === "amount" || entry.dataKey === "average"
                    ? formatCurrency(entry.value) + " ل.س"
                    : entry.value}
                </Text>
              </HStack>
            </Box>
          ))}
          {data.isLocalStorage && (
            <Badge colorScheme="green" mt={2}>
              💾 من localStorage
            </Badge>
          )}
        </Box>
      );
    }
    return null;
  };

  // إحصائيات إضافية
  const stats = useMemo(() => {
    const totalAmount = chartData.reduce((sum, day) => sum + day.amount, 0);
    const totalOrders = chartData.reduce((sum, day) => sum + day.orders, 0);
    const avgDaily = chartData.length > 0 ? totalAmount / chartData.length : 0;
    const peakDay = Math.max(...chartData.map((d) => d.amount), 0);
    const lowestDay = Math.min(
      ...chartData.filter((d) => d.amount > 0).map((d) => d.amount),
      peakDay
    );
    const growth =
      chartData.length > 1
        ? (
            ((chartData[chartData.length - 1].amount - chartData[0].amount) /
              chartData[0].amount) *
            100
          ).toFixed(1)
        : 0;

    return {
      totalAmount,
      totalOrders,
      avgDaily,
      peakDay,
      lowestDay,
      growth,
      avgOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0,
      isDemo: chartData.some((d) => d.isDemo),
      hasLocalStorageData: chartData.some((d) => d.isLocalStorage),
    };
  }, [chartData]);

  // زر لإعادة تحميل البيانات من localStorage
  const reloadLocalStorageData = () => {
    try {
      const savedData = localStorage.getItem("banshee-ana");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setLocalStorageData(parsedData);
      }
    } catch (error) {
      console.error("Error reloading data from localStorage:", error);
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {/* تحكم في الرسم البياني */}
      <Card bg="bg-card" borderRadius="lg" boxShadow="md">
        <CardBody>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Heading size="lg" color="white" mb={2}>
                📈 تحليل المبيعات
              </Heading>
              <Text color="gray.400" fontSize="sm">
                تتبع أداء مبيعاتك مع مرور الوقت
              </Text>
            </Box>

            <HStack spacing={4}>
              {stats.hasLocalStorageData && (
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={reloadLocalStorageData}
                  leftIcon={<span>🔄</span>}>
                  تحديث البيانات
                </Button>
              )}

              <ButtonGroup size="sm" isAttached variant="outline">
                <Button
                  colorScheme={chartType === "line" ? "blue" : "gray"}
                  onClick={() => setChartType("line")}>
                  📈 خطي
                </Button>
                <Button
                  colorScheme={chartType === "area" ? "green" : "gray"}
                  onClick={() => setChartType("area")}>
                  🌊 مساحي
                </Button>
              </ButtonGroup>

              <Select
                size="sm"
                w="120px"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                bg="whiteAlpha.100"
                borderColor="whiteAlpha.300"
                color="white">
                <option value="7days">٧ أيام</option>
                <option value="30days">٣٠ يوم</option>
                <option value="all">٩٠ يوم</option>
              </Select>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* منحنى بياني رئيسي */}
      <Card bg="bg-card" borderRadius="lg" boxShadow="md">
        <CardHeader>
          <Heading size="md" color="white">
            {chartType === "line" ? "📈 منحنى المبيعات" : "🌊 تدفق الإيرادات"}
          </Heading>
        </CardHeader>
        <CardBody>
          <Box h="400px" w="100%">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#4A5568"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#A0AEC0"
                    fontSize={12}
                    tick={{ fill: "#A0AEC0" }}
                    axisLine={{ stroke: "#4A5568" }}
                  />
                  <YAxis
                    stroke="#A0AEC0"
                    fontSize={12}
                    tick={{ fill: "#A0AEC0" }}
                    axisLine={{ stroke: "#4A5568" }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#48BB78" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="الإيرادات"
                    stroke="#48BB78"
                    fill="url(#colorAmount)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="average"
                    name="متوسط الطلب"
                    stroke="#9F7AEA"
                    fill="url(#colorAverage)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <defs>
                    <linearGradient
                      id="colorAverage"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="5%" stopColor="#9F7AEA" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#9F7AEA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#4A5568"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="#A0AEC0"
                    fontSize={12}
                    tick={{ fill: "#A0AEC0" }}
                    axisLine={{ stroke: "#4A5568" }}
                  />
                  <YAxis
                    stroke="#A0AEC0"
                    fontSize={12}
                    tick={{ fill: "#A0AEC0" }}
                    axisLine={{ stroke: "#4A5568" }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="الإيرادات"
                    stroke="#48BB78"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="متوسط الطلب"
                    stroke="#9F7AEA"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>

      {/* إحصائيات سريعة */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card bg="blue.900" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel color="blue.200">إجمالي الإيرادات</StatLabel>
              <StatNumber color="white" fontSize="xl">
                {formatCurrency(stats.totalAmount)}
              </StatNumber>
              <StatHelpText color="blue.300">
                {stats.isDemo
                  ? "تقدير"
                  : stats.hasLocalStorageData
                  ? "💾 محفوظة"
                  : "فعلي"}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="green.900" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel color="green.200">معدل النمو</StatLabel>
              <StatNumber color="white" fontSize="xl">
                {stats.growth}%
              </StatNumber>
              <StatHelpText
                color={parseFloat(stats.growth) >= 0 ? "green.300" : "red.300"}>
                {parseFloat(stats.growth) >= 0
                  ? "📈 في ارتفاع"
                  : "📉 في انخفاض"}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="purple.900" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel color="purple.200">أعلى يوم</StatLabel>
              <StatNumber color="white" fontSize="xl">
                {formatCurrency(stats.peakDay)}
              </StatNumber>
              <StatHelpText color="purple.300">🎯 قمة الأداء</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="orange.900" borderRadius="lg">
          <CardBody>
            <Stat>
              <StatLabel color="orange.200">متوسط الطلب</StatLabel>
              <StatNumber color="white" fontSize="xl">
                {formatCurrency(stats.avgOrderValue)}
              </StatNumber>
              <StatHelpText color="orange.300">💰 لكل عملية</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* رسم بياني إضافي للطلبات */}
      <Card bg="bg-card" borderRadius="lg" boxShadow="md">
        <CardHeader>
          <Heading size="md" color="white">
            📊 توزيع الطلبات
          </Heading>
        </CardHeader>
        <CardBody>
          <Box h="300px" w="100%">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#4A5568"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#A0AEC0"
                  fontSize={12}
                  tick={{ fill: "#A0AEC0" }}
                  axisLine={{ stroke: "#4A5568" }}
                />
                <YAxis
                  stroke="#A0AEC0"
                  fontSize={12}
                  tick={{ fill: "#A0AEC0" }}
                  axisLine={{ stroke: "#4A5568" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="عدد الطلبات"
                  stroke="#4299E1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="الإيرادات (مقاييس)"
                  stroke="#48BB78"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  yAxisId={1}
                  hide={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>

      {/* تحذير البيانات التجريبية */}
      {stats.isDemo && !stats.hasLocalStorageData && (
        <Alert
          status="info"
          borderRadius="lg"
          variant="left-accent"
          flexDirection="column"
          alignItems="flex-start">
          <HStack w="100%">
            <AlertIcon />
            <Box flex="1">
              <Text fontWeight="bold">💡 عرض توضيحي</Text>
              <Text fontSize="sm">
                هذا رسم بياني توضيحي. أضف مبيعات حقيقية أو استخدم البيانات
                المحفوظة لترى بياناتك الفعلية.
              </Text>
            </Box>
            <Badge colorScheme="blue" variant="solid">
              Demo Mode
            </Badge>
          </HStack>
        </Alert>
      )}

      {/* مؤشر البيانات من localStorage */}
      {stats.hasLocalStorageData && (
        <Alert status="success" borderRadius="lg" variant="left-accent">
          <HStack w="100%">
            <AlertIcon />
            <Box flex="1">
              <Text fontWeight="bold">💾 بيانات من localStorage</Text>
              <Text fontSize="sm">
                يتم عرض البيانات المحفوظة باسم "banshee-ana". يوجد{" "}
                {localStorageData.length} يوم من البيانات.
              </Text>
            </Box>
            <Badge colorScheme="green" variant="solid">
              {localStorageData.length} أيام
            </Badge>
          </HStack>
        </Alert>
      )}
    </VStack>
  );
};

export default GraphicalAnalysis;

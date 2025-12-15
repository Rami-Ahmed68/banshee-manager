import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  InfoIcon,
  TimeIcon,
  AtSignIcon,
} from "@chakra-ui/icons";

export default function Payments() {
  const paymentMethods = [
    {
      title: "الدفع النقدي",
      description: "الدفع عند الاستلام داخل المركز",
      icon: CheckCircleIcon,
      status: "متاح",
    },
    {
      title: "بطاقات بنكية",
      description: "فيزا / ماستر كارد",
      icon: AtSignIcon,
      status: "متاح",
    },
    {
      title: "الدفع الإلكتروني",
      description: "Apple Pay / Google Pay",
      icon: InfoIcon,
      status: "متاح",
    },
    {
      title: "تحويل بنكي",
      description: "تحويل مباشر إلى حساب المركز",
      icon: TimeIcon,
      status: "قريباً",
    },
  ];

  return (
    <Box p={6}>
      {/* Page Title */}
      <Heading
        size="md"
        mb={4}
        color="green.300"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        المدفوعات :
        <Badge colorScheme="green" px={2} py={1} borderRadius="md">
          {0}
        </Badge>
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {paymentMethods.map((method, index) => (
          <Box
            key={index}
            p={5}
            borderRadius="md"
            bg="bg-card"
            shadow="md"
            transition="0.2s"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "lg",
              bg: "bg-card-status",
            }}>
            <VStack spacing={3} align="start">
              <Icon as={method.icon} boxSize={6} />

              <Heading size="md">{method.title}</Heading>

              <Text fontSize="sm" opacity={0.85}>
                {method.description}
              </Text>

              <Badge
                colorScheme={method.status === "متاح" ? "green" : "orange"}>
                {method.status}
              </Badge>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

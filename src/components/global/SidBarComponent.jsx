import { Box, VStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom"; // ✅ استيراد من react-router-dom

export default function SidBar() {
  const links = [
    { en_title: "Home", ar_title: "الصفحة الرئيسية", path: "/" },
    { en_title: "Sales", ar_title: "المبيعات", path: "/sales" },
    { en_title: "Add Meal", ar_title: "إضافة وجبة", path: "/add-meal" },
    { en_title: "Add Category", ar_title: "إضافة صنف", path: "/add-category" },
    { en_title: "Payments", ar_title: "المدفوعات", path: "/payments" },
  ];

  return (
    <Box
      w="20%"
      h="98vh"
      m="1vh 0%"
      color="white"
      p={4}
      bg="bg-secondary"
      borderRadius={"5px"}>
      <Text fontSize="xl" mb={4}>
        menu
      </Text>
      <VStack align="start" spacing={4}>
        {links.map((link) => (
          <ChakraLink
            as={Link}
            to={link.path}
            key={link.en_title}
            _hover={{ color: "yellow", textDecoration: "none" }}>
            {link.en_title}
          </ChakraLink>
        ))}
      </VStack>
    </Box>
  );
}

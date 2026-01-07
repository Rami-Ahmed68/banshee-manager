import { Box, VStack, Link as ChakraLink, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom"; // ✅ استيراد من react-router-dom

export default function SidBar() {
  const links = [
    { title: "🏠 الصفحة الرئيسية", path: "/" },
    { title: "💰 المبيعات", path: "/sales" },
    { title: "🍽️ إضافة وجبة", path: "/add-meal" },
    { title: "📁 إضافة صنف", path: "/add-category" },
    { title: "🧾 الفواتير", path: "/payments" },
    { title: "📉 التحليل البياني", path: "/ana" },
    { title: "📥 حفظ", path: "/save" },
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
      <Heading fontSize="xl" mb={4}>
        القائمة
      </Heading>
      <VStack align="start">
        {links.map((link) => (
          <ChakraLink
            w="100%"
            h="40px"
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
            borderRadius={"5px"}
            p={"3px 5px"}
            transitionDuration={"0.5s"}
            as={Link}
            to={link.path}
            key={link.title}
            _hover={{
              color: "white",
              backgroundColor: "#333",
            }}>
            {link.title}
          </ChakraLink>
        ))}
      </VStack>
    </Box>
  );
}

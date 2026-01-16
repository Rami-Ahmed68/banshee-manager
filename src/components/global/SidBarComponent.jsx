import {
  Box,
  VStack,
  Link as ChakraLink,
  Heading,
  IconButton,
  useColorMode,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function SidBar() {
  const links = [
    { title: "🏠 الصفحة الرئيسية", path: "/" },
    { title: "💰 المبيعات", path: "/sales" },
    { title: "🍽️ إضافة وجبة", path: "/add-meal" },
    { title: "➕ إضافة صنف", path: "/add-category" },
    { title: "🧾 الفواتير", path: "/payments" },
    { title: "📥 حفظ", path: "/save" },
    { title: "📂 فتح ملف", path: "/open" },
    { title: "📥 تنزيل التطبيق", path: "/install" },
  ];

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      w="15%"
      h="98vh"
      m="1vh 0%"
      color="white"
      p={4}
      bg="bg-secondary"
      borderRadius={"5px"}
      display="flex"
      flexDirection="column"
      justifyContent="space-between">
      <Box>
        <Heading fontSize="xl" mb={4}>
          القائمة
        </Heading>
        <VStack align="start" mb={4}>
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
              color="text-theme"
              _hover={{
                color: "white",
                backgroundColor: "#333",
              }}>
              {link.title}
            </ChakraLink>
          ))}
        </VStack>
      </Box>

      {/* زر تغيير الثيم */}
      <Flex justify="center" py={4}>
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          colorScheme="teal"
          variant="solid"
          size="lg"
          borderRadius="full"
          w="50px"
          h="50px"
        />
      </Flex>
    </Box>
  );
}

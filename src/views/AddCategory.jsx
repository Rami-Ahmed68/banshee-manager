import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useNotification } from "../hooks/useNotifications";
import { useState, useContext } from "react";
import { BansheeContext } from "../hooks/bansheeContext";
import Category from "../components/category/Category";
import Meal from "../components/meal/meal";

function AddCategory() {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const { AddCategory, categorys, categorMealsList } =
    useContext(BansheeContext);

  const handelCreateCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!title || title.length === 0) {
        setIsLoading(false);
        return showError("🚨 عذرا يجب كتابة عنوان الصنف");
      }

      AddCategory({ title });

      showSuccess("🥳 تم إنشاء الصنف بنجاح");

      setTitle(""); // ← فقط هذا يكفي لتنظيف الحقل
    } catch (error) {
      showError("خطأ عام 🚨");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%" h="100%">
      <Heading
        size="lg"
        mb={6}
        borderBottom="1px solid white"
        w="98%"
        m="10px 1%">
        إضافة صنف جديد
      </Heading>

      <VStack align="stretch" spacing={4} w="98%" m="0px 1%">
        <FormControl>
          <FormLabel
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            اسم الصنف <span>{title.length}</span>
          </FormLabel>

          <Input
            placeholder="مثال: وجبات عربية / غربية"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="green"
          onClick={handelCreateCategory}
          isLoading={isLoading}>
          إضافة الصنف
        </Button>
      </VStack>

      <Box
        mt={10}
        w="98%"
        m="10px 1%"
        p={4}
        borderRadius="lg"
        bg="bg-secondary"
        boxShadow="lg">
        <Heading
          size="md"
          mb={4}
          color="green.300"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}>
          الأصناف الحالية
          <Badge colorScheme="green" px={2} py={1} borderRadius="md">
            {categorys.length}
          </Badge>
        </Heading>

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
          gap={4}
          maxH="300px"
          overflowY="scroll"
          pr={2}>
          {categorys.map((category, index) => (
            <Category data={category} key={index} />
          ))}
        </Box>
      </Box>

      <Box
        mt={10}
        w="98%"
        m="10px 1%"
        p={4}
        borderRadius="lg"
        bg="bg-secondary"
        boxShadow="lg">
        <Heading
          size="md"
          mb={4}
          color="green.300"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}>
          وجبات الصنف
          <Badge colorScheme="green" px={2} py={1} borderRadius="md">
            {categorMealsList.length}
          </Badge>
        </Heading>

        {categorMealsList.length < 1 ? (
          <Text w="100%" textAlign={"center"}>
            😥اختر صنف ما لعرض وجباته😥
          </Text>
        ) : null}

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
          gap={4}
          maxH="300px"
          overflowY="scroll"
          pr={2}>
          {categorMealsList.map((meal, index) => (
            <Meal data={meal} key={index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default AddCategory;

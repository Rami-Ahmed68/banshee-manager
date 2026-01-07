import {
  Heading,
  Box,
  SimpleGrid,
  VStack,
  Text,
  Badge,
  HStack,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { BansheeContext } from "../hooks/bansheeContext";
import ShowMeal from "../components/sales/showMeal";
import { useNotification } from "../hooks/useNotifications";

export default function Home() {
  const {
    categorys,
    categorMealsList,
    filter_meals,
    sale,
    DeleteOneProduct,
    AddSales,
    setSale,
  } = useContext(BansheeContext);

  const { showError, showSuccess } = useNotification();

  // Added optional chaining to prevent errors if categorys is undefined
  const categoriesList = categorys || [];
  const mealsList = categorMealsList || [];

  const handelDeleteOneOrder = (id) => {
    console.log("clicked");
    DeleteOneProduct(id);
  };

  const handelAddSale = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      AddSales();

      if (sale.length <= 0) {
        return showError("🚨 عذرا يجب اضافة وجبة ما الى الفاتورة");
      }

      showSuccess("🥳 تم إضافة العملية الى السلة بنجاح");
    } catch (error) {
      showError("خطأ عام 🚨");
    } finally {
    }

    setSale([]);
  };

  return (
    <Box p={4}>
      <Heading
        mb={6}
        textAlign="start"
        color="green.300"
        borderBottom="1px solid white">
        الصفحة الرئيسية
      </Heading>

      <SimpleGrid columns={10} spacing={1}>
        {/* First Column - Categories List */}
        <Box
          as="ul"
          bg="bg-card"
          h="90vh"
          listStyleType="none"
          gridColumn="span 2"
          p={4}
          m={0}
          borderRadius="lg"
          boxShadow="lg"
          overflowY="auto"
          _hover={{ boxShadow: "xl" }}
          transition="all 0.3s ease">
          {categoriesList.map((cat) => (
            <Box
              as="li"
              key={cat.id}
              width="100%"
              height="45px"
              borderRadius="md"
              backgroundColor="bg-card"
              marginBottom="8px"
              display="flex"
              alignItems="center"
              justifyContent="start"
              color="white"
              fontWeight="semibold"
              p="0px 16px"
              cursor="pointer"
              transition="all 0.2s ease-in-out"
              _hover={{
                backgroundColor: "bg-body",
                transform: "translateX(5px)",
                boxShadow: "lg",
                borderLeft: "5px solid green",
              }}
              onClick={() => filter_meals(cat.id)}>
              {cat.title}
            </Box>
          ))}
        </Box>

        {/* Second Column - Meals Grid */}
        <Box gridColumn="span 4" h="90vh" overflowY="auto">
          <VStack
            spacing={1}
            p={4}
            bg="bg-card"
            h="100%"
            borderRadius="lg"
            boxShadow="lg"
            transition="all 0.3s ease"
            _hover={{ boxShadow: "xl" }}
            overflowY="auto">
            {mealsList.map((meal) => (
              <ShowMeal data={meal} key={meal.id || meal._id} />
            ))}
            {mealsList.length === 0 && (
              <Box
                w="90%"
                p="4px"
                bg="bg-card"
                borderRadius="3px"
                gridColumn="1 / -1"
                textAlign="center">
                🤷‍♂️لا توجد وجبات في هذه الفئة🤷‍♂️
              </Box>
            )}
          </VStack>
        </Box>

        {/* Third Column - Order/Cart */}
        <VStack
          bg="bg-card"
          h="90vh"
          spacing={2}
          gridColumn="span 4"
          p={4}
          borderRadius="lg"
          boxShadow="lg"
          transition="all 0.3s ease"
          _hover={{ boxShadow: "xl" }}
          overflowY="auto">
          <Heading
            w="100%"
            size="md"
            color="green.300"
            mb={2}
            borderBottom="1px solid white">
            الطلب الحالي
          </Heading>

          <Box
            w="100%"
            h="80%"
            bg="bg-card"
            overflowY={"scroll"}
            borderRadius="10px"
            p="5px"
            textAlign="center">
            <HStack
              w="100%"
              borderBottom="1px solid white"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Text color="green.300">المبلغ الإجمالي للفاتورة</Text>
              <Badge
                colorScheme="green"
                px={3}
                py={1}
                borderRadius="md"
                fontSize="lg">
                ${" "}
                {sale
                  .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
                  .toLocaleString()}
              </Badge>
            </HStack>
            {sale.map((ele, index) => (
              <Box
                key={index}
                mb={2}
                p="10px 2px"
                bg="bg-card"
                boxShadow="0px 3px 5px black"
                borderRadius="md"
                w="96%"
                m="10px 2%"
                display={"flex"}
                flexWrap={"wrap"}
                justifyContent={"space-around"}
                alignItems={"center"}>
                <Badge size="md" fontWeight="bold">
                  اسم الوجبة : {ele.title}
                </Badge>
                <Badge size="md" colorScheme="blue">
                  السعر: $ {ele.price}
                </Badge>
                <Badge size="md" colorScheme="yellow">
                  الكمية: {ele.quantity}
                </Badge>
                <Badge size="md" color="green.200" fontWeight="bold">
                  الإجمالي: {ele.totalPrice} $
                </Badge>

                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handelDeleteOneOrder(index)}
                />
              </Box>
            ))}
          </Box>
          <Button
            icon={<PlusSquareIcon />}
            title="add"
            size="md"
            w="100%"
            aria-label="إضافة إلى الطلبات"
            colorScheme="green"
            _hover={{ opacity: 0.8 }}
            onClick={() => handelAddSale()}>
            إضافة الفاتورة
          </Button>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { PlusSquareIcon, MinusIcon, AddIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { BansheeContext } from "../../hooks/bansheeContext";
import { useNotification } from "../../hooks/useNotifications";

function ShowMeal({ data }) {
  const { ChooseProducts } = useContext(BansheeContext);
  const [quantity, setQuantity] = useState(0);
  const { showError } = useNotification();

  const handleAddToCart = () => {
    if (quantity <= 0) {
      return showError("🚨 عذرا يجب تحديد عدد عناصر المادة");
    }
    ChooseProducts({
      id: data.id,
      title: data.title,
      price: data.price,
      quantity: quantity,
      totalPrice: data.price * quantity,
    });

    setQuantity(1);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <Box
      w="100%"
      p={5}
      borderRadius="md"
      bg="bg-card"
      color="white"
      shadow="md"
      transition="0.2s"
      _hover={{
        transform: "scale(1.01)",
        shadow: "lg",
        bg: "bg-card-status",
      }}>
      {/* Title + Price */}
      <HStack justify="space-between" mb={2}>
        <Heading size="md" cursor="pointer">
          {data.title}
        </Heading>

        <Badge
          colorScheme="green"
          px={3}
          py={1}
          borderRadius="md"
          fontSize="sm">
          {data.price.toLocaleString()} $
        </Badge>
      </HStack>

      {/* Description */}
      <Text fontSize="sm" opacity={0.85} mb={3}>
        {data.description || "لا يوجد وصف للوجبة"}
      </Text>

      <Divider opacity={0.2} mb={3} />

      <VStack spacing={3} align="start">
        {/* Created at */}
        <HStack>
          <Text fontSize="xs">تاريخ الانشاء:</Text>
          <Badge colorScheme="blue" px={2} py={1} borderRadius="md" size="xs">
            {data.created_at}
          </Badge>
        </HStack>

        {/* Quantity Control */}
        <Box w="100%">
          <Text fontSize="xs" mb={1}>
            الكمية:
          </Text>
          <HStack>
            <IconButton
              icon={<MinusIcon />}
              size="md"
              aria-label="تقليل الكمية"
              colorScheme="red"
              isDisabled={quantity < 1}
              onClick={decreaseQuantity}
            />

            <Input
              value={quantity}
              onChange={handleQuantityChange}
              size="md"
              width="60px"
              textAlign="center"
              bg="white"
              color="black"
              type="number"
              min={1}
            />

            <IconButton
              icon={<AddIcon />}
              size="md"
              aria-label="زيادة الكمية"
              colorScheme="blue"
              onClick={increaseQuantity}
            />
          </HStack>
        </Box>

        {/* Add to Cart Button */}
        <IconButton
          icon={<PlusSquareIcon />}
          size="md"
          w="100%"
          aria-label="إضافة إلى الطلبات"
          colorScheme="green"
          _hover={{ opacity: 0.8 }}
          onClick={() => handleAddToCart()}
        />
      </VStack>
    </Box>
  );
}

export default ShowMeal;

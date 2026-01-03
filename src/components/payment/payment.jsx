import { DeleteIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useNotification } from "../../hooks/useNotifications";
import { BansheeContext } from "../../hooks/bansheeContext";
export default function Payment(data) {
  const { showSuccess, ShowError } = useNotification();
  const { DeletePayment, ChangePaymentStatus } = useContext(BansheeContext);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const handelDeletePaymentMethod = async (id) => {
    try {
      setIsLoading1(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      DeletePayment(id);
      return showSuccess("🥳 تم حذف الفاتورة بنجاح");
    } catch (error) {
      return ShowError("🚨 عذرا خطأ عام");
    } finally {
      setIsLoading1(false);
    }
  };

  const handelChangePaymentStatusMethod = async (id) => {
    setIsLoading2(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      ChangePaymentStatus(data.id);
      return showSuccess("🥳 تم تغيير حالة الفاتورة بنجاح");
    } catch (error) {
      return ShowError("🚨 عذرا خطأ عام");
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <Box
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
        <Heading size="md">{data.title}</Heading>

        {data.description ? (
          <Text fontSize="sm" opacity={0.85}>
            {data.description}
          </Text>
        ) : null}

        <Badge colorScheme={data.status ? "green" : "red"}>
          {data.status ? "✅ تم الدفع" : "❌ غير مدفوع"}
        </Badge>

        <Badge colorScheme="green">🗓️ {data.created_at}</Badge>
        <Badge colorScheme="green">💵 {data.price.toLocaleString()}</Badge>

        <Box>
          <IconButton
            size="sm"
            m="0px 3px"
            icon={<DeleteIcon />}
            aria-label="Delete"
            colorScheme="red"
            isLoading={isLoading1}
            onClick={() => handelDeletePaymentMethod(data.id)}
          />
          <IconButton
            size="sm"
            m="0px 3px"
            icon={<RepeatIcon />}
            aria-label="Rotate"
            colorScheme="green"
            isLoading={isLoading2}
            onClick={() => handelChangePaymentStatusMethod(data.id)}
          />
        </Box>
      </VStack>
    </Box>
  );
}

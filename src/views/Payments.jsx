import {
  Box,
  Heading,
  SimpleGrid,
  Badge,
  FormControl,
  Input,
  Button,
  FormLabel,
  VStack,
  Textarea,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { BansheeContext } from "../hooks/bansheeContext";
import Payment from "../components/payment/payment";
import { useNotification } from "../hooks/useNotifications";

export default function Payments() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(null);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const { payments, AddPayment } = useContext(BansheeContext);
  const { showSuccess, showError } = useNotification();

  const handelCreatePayment = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!title) {
        setIsLoading(false);
        return showError("🚨 عذرا يجب كتابة عنوان الصنف");
      }

      if (title.length < 3) {
        setIsLoading(false);
        return showError(
          "🚨 عذرا من غير الممكن ان يكون عدد احرف العنوان اقل من 3"
        );
      }

      if (!price) {
        setIsLoading(false);
        return showError("🚨 عذرا يجب كتابة مبلغ الفاتورة");
      }

      if (price < 1000) {
        setIsLoading(false);
        return showError("🚨 عذرا لا يمكن ان يكون المبلغ اقل من 1000 ليرة");
      }

      if (status === null) {
        setIsLoading(false);
        return showError("عذرا يجب اختيار حالة الفاتورة");
      }

      AddPayment({
        title,
        description,
        price,
        status,
      });

      setTitle("");
      setPrice(0);
      setDescription("");
      setStatus(null);

      showSuccess("🥳 تم انشاء الفاتورة بنجاح");
    } catch (error) {
      showError("خطأ عام 🚨");
    } finally {
      setIsLoading(false);
    }
  };

  const paidTotal = payments
    .filter((p) => p.status === true)
    .reduce((sum, p) => sum + p.price, 0);

  const unpaidTotal = payments
    .filter((p) => p.status === false)
    .reduce((sum, p) => sum + p.price, 0);

  const allTotal = payments.reduce((sum, p) => sum + p.price, 0);

  return (
    <Box p={6}>
      {/* Form */}
      <VStack align="stretch" spacing={4} w="98%" m="0px 1%">
        <Heading
          size="md"
          mb={4}
          color="green.300"
          borderBottom="1px solid white">
          إضافة فاتورة
        </Heading>

        <FormControl>
          <FormLabel display="flex" justifyContent="space-between">
            عنوان الفاتورة <span>{title.length}</span>
          </FormLabel>
          <Input
            type="text"
            placeholder="اكتب عنوان الفاتورة هنا"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>مبلغ الفاتورة</FormLabel>
          <Input
            type="number"
            placeholder="اكتب مبلغ الفاتورة هنا"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>وصف الفاتورة</FormLabel>
          <Textarea
            placeholder="اكتب وصف الفاتورة هنا"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <RadioGroup
            value={status === null ? "" : status ? "paid" : "unpaid"}
            onChange={(val) => setStatus(val === "paid")}>
            <HStack justifyContent="space-around">
              <Radio value="paid">تم الدفع</Radio>
              <Radio value="unpaid">غير مدفوع</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <Button
          colorScheme="green"
          onClick={handelCreatePayment}
          isLoading={isLoading}>
          إضافة الفاتورة
        </Button>
      </VStack>

      {/* Summary */}
      <Heading size="md" mt={10} mb={4} color="green.300">
        المدفوعات 💵
      </Heading>

      <HStack spacing={3} mb={6} wrap="wrap">
        <Badge
          fontSize="sm"
          px={3}
          py={1}
          borderRadius="md"
          colorScheme="green">
          تم الدفع: {paidTotal.toLocaleString()}
        </Badge>

        <Badge fontSize="sm" px={3} py={1} borderRadius="md" colorScheme="red">
          غير مدفوع: {unpaidTotal.toLocaleString()}
        </Badge>

        <Badge fontSize="sm" px={3} py={1} borderRadius="md" colorScheme="blue">
          الإجمالي: {allTotal.toLocaleString()}
        </Badge>

        <Badge
          fontSize="sm"
          px={3}
          py={1}
          borderRadius="md"
          colorScheme="purple">
          عدد الفواتير: {payments.length}
        </Badge>
      </HStack>

      {/* Payments List */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {payments.length > 0 ? (
          payments.map((payment, index) => <Payment key={index} {...payment} />)
        ) : (
          <Box gridColumn="1 / -1">
            <Heading
              size="md"
              p={5}
              borderRadius="md"
              bg="bg-card"
              shadow="md"
              textAlign="center">
              عذرا لا يوجد اي فاتورة حاليا
            </Heading>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
}

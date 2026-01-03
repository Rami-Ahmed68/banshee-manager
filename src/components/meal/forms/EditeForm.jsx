import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  Icon,
  VStack,
  Input,
} from "@chakra-ui/react";
import { EditIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { useContext, useState, useEffect } from "react";
import { BansheeContext } from "../../../hooks/bansheeContext";
import { useNotification } from "../../../hooks/useNotifications";

export default function EditCategoryForm() {
  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [id, setId] = useState("");

  const { mealUpForm, UpdateMeal, setMealUpForm, mealUpData } =
    useContext(BansheeContext);
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mealUpForm && mealUpData) {
      setTitle(mealUpData.title || "");
      setDescription(mealUpData.description || "");
      setPrice(mealUpData.price || 0);
      setId(mealUpData.id || mealUpData._id || "");
    }
  }, [mealUpForm, mealUpData]);

  // Clear form when modal closes
  useEffect(() => {
    if (!mealUpForm) {
      resetForm();
    }
  }, [mealUpForm]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setId("");
  };

  const handleUpdate = async () => {
    if (!id) {
      showError("🚨 لم يتم تحديد الوجبة للتعديل");
      return;
    }

    if (!title.trim()) {
      showError("🚨 يجب إدخال عنوان للوجبة");
      return;
    }

    if (price < 0) {
      showError("🚨 السعر لا يمكن أن يكون سالبًا");
      return;
    }

    setIsLoading(true);

    try {
      const updatedData = {
        id: id, // أو _id حسب back-end
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
      };

      // Call update function with proper data
      await UpdateMeal(updatedData);

      showSuccess("🥳 تم تعديل الوجبة بنجاح");

      // Close modal after successful update
      setMealUpForm(false);
      resetForm();
    } catch (error) {
      console.error("Update error:", error);
      showError(error.message || "🚨 حدث خطأ أثناء التعديل");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setMealUpForm(false);
    resetForm();
  };

  return (
    <Modal isOpen={mealUpForm} onClose={handleCancel} isCentered>
      <ModalOverlay />
      <ModalContent bg="bg-card" dir="rtl">
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Text>تعديل بيانات الوجبة</Text>
            <Icon as={WarningTwoIcon} w={6} h={6} color="yellow.500" />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium">تعديل بيانات الوجبة المحددة</Text>

            {id && (
              <Text fontSize="sm" color="gray.500">
                رقم الوجبة: {id}
              </Text>
            )}

            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اسم الوجبة"
              isRequired
            />
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف الوجبة"
            />
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="سعر الوجبة"
              min="0"
              step="0.01"
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={handleCancel}
            isDisabled={isLoading}>
            إلغاء
          </Button>
          <Button
            colorScheme="blue"
            leftIcon={<EditIcon />}
            onClick={handleUpdate}
            isLoading={isLoading}
            loadingText="جاري التعديل...">
            حفظ التعديلات
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

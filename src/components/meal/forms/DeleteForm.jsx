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
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { DeleteIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { BansheeContext } from "../../../hooks/bansheeContext";
import { useNotification } from "../../../hooks/useNotifications";

export default function DeleteMealForm() {
  const { mealForm, setMealForm, DeleteMeal } = useContext(BansheeContext);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose } = useDisclosure();
  const [delWord, setDelWord] = useState();
  const { showError, showSuccess } = useNotification();

  const handelDelete = async () => {
    // chking if there a delete word
    if (!delWord || delWord !== "حذف") {
      showError("🚨 عذرا يجب كتابة كلمة حذف لمتابعة العملية");
      setMealForm(false);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      DeleteMeal();

      showSuccess("🥳 تم حذف الوجبة بنجاح");
    } catch (error) {
      showError("خطأ عام 🚨");
    } finally {
      setIsLoading(false);
      setMealForm(false);
    }
  };

  return (
    <Modal isOpen={mealForm} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="bg-card" dir={"rtl"}>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Text>حذف الوجبة</Text>
            <Icon as={WarningTwoIcon} w={6} h={6} color="red.500" />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>هل انت متأكد من حذف هذه الوجبة </Text>

            <Input
              type="text"
              placeholder="اكتب حذف للمتابعة"
              onChange={(e) => setDelWord(e.target.value)}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setMealForm(false)}>
            إلغاء
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={() => handelDelete()}
            isLoading={isLoading}>
            حذف الصنف
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

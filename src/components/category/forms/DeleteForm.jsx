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
import { DeleteIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { BansheeContext } from "../../../hooks/bansheeContext";
import { useNotification } from "../../../hooks/useNotifications";

export default function DeleteCategoryModal() {
  const [deleteWord, setDeleteWord] = useState("");
  const { catForm, DeleteCategory, setCatForm } = useContext(BansheeContext);
  const { showSuccess, showError } = useNotification();
  const { isOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handelDelete = async () => {
    if (!deleteWord || deleteWord !== "حذف") {
      setCatForm(false);
      showError("🚨 عذرا يجب ان تكتب كلمة حذف للتأكيد");
      return;
    }
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      DeleteCategory();

      showSuccess("🥳 تم حذف الصنف والوجبات التابعة له بنجاح");
    } catch (error) {
      showError("خطأ عام 🚨");
    } finally {
      setIsLoading(false);
      setCatForm(false);
    }
  };

  return (
    <Modal isOpen={catForm} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="bg-card" dir={"rtl"}>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Text>حذف الصنف</Text>
            <Icon as={WarningTwoIcon} w={6} h={6} color="red.500" />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              هل انت متأكد من حذف هذا الصنف{" "}
              <strong> سيتم حذف جميع الوجبات التابعة له</strong>
            </Text>

            <Input
              type="text"
              placeholder="اكتب حذف للمتابعة"
              onChange={(e) => setDeleteWord(e.target.value)}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setCatForm(false)}>
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

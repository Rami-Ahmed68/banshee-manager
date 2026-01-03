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
import { EditIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { BansheeContext } from "../../../hooks/bansheeContext";
import { useNotification } from "../../../hooks/useNotifications";

export default function EditeCategoryForm() {
  const [title, setTitle] = useState("");
  const { catUpForm, UpdateCaytegory, setCatUpForm } =
    useContext(BansheeContext);
  const { showSuccess, showError } = useNotification();
  const { isOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handelDelete = async () => {
    if (!title) {
      setCatUpForm(false);
      showError("🚨 عذرا يجب ان تكتب العنوان الجديد");
      return;
    }
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      UpdateCaytegory(title);

      showSuccess("🥳 تم تغيير اسم الصنف بنجاح");
    } catch (error) {
      showError("خطأ عام 🚨");
    } finally {
      setIsLoading(false);
      setCatUpForm(false);
    }
  };

  return (
    <Modal isOpen={catUpForm} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="bg-card" dir={"rtl"}>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Text>تغيير اسم الصنف</Text>
            <Icon as={WarningTwoIcon} w={6} h={6} color="red.500" />
          </Flex>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>هل انت متأكد من تغيير اسم الصنف </Text>

            <Input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب العنوان الجديد هن"
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => setCatUpForm(false)}>
            إلغاء
          </Button>
          <Button
            colorScheme="blue"
            leftIcon={<EditIcon />}
            onClick={() => handelDelete()}
            isLoading={isLoading}>
            تعديل الصنف
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { BansheeContext } from "../hooks/bansheeContext";
import { useNotification } from "../hooks/useNotifications";

function AddMeal() {
  const { AddMeal, categorys } = useContext(BansheeContext);
  const { showSuccess, showError } = useNotification();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handelCreateMeal = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // ----- Validations -----
      if (!title) {
        setIsLoading(false);
        return showError("الرجاء ملئ خانة العنوان 🚨");
      }

      if (title.length < 2) {
        setIsLoading(false);
        return showError("عنوان الوجبة يجب أن يكون أكثر من حرفين 🚨");
      }

      if (!description) {
        setIsLoading(false);
        return showError("الرجاء ملئ خانة الوصف 🚨");
      }

      if (description.length < 10) {
        setIsLoading(false);
        return showError("وصف الوجبة يجب أن يكون 10 أحرف على الأقل 🚨");
      }

      if (!price || Number(price) <= 0) {
        setIsLoading(false);
        return showError("السعر يجب أن يكون رقمًا أكبر من صفر 🚨");
      }

      if (!category) {
        setIsLoading(false);
        return showError("يجب اختيار صنف الوجبة 🚨");
      }

      // ----- Add meal -----
      AddMeal({
        title,
        description,
        price: Number(price),
        category,
      });

      showSuccess("تمت إضافة الوجبة بنجاح 🥳");

      // Reset fields
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
    } catch (err) {
      showError("حدث خطأ غير متوقع 🚨");
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
        إضافة وجبة جديدة
      </Heading>

      <VStack align="stretch" spacing={4} w="98%" m="0px 1%">
        {/* Title */}
        <FormControl>
          <FormLabel
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            اسم الوجبة <span>{title.length}</span>
          </FormLabel>
          <Input
            placeholder="مثال: وجبة عربي / وجبة كريسبي"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            وصف الوجبة <span>{description.length}</span>
          </FormLabel>
          <Input
            placeholder="مثال: صندويشة على رغيفين شاورما / بطاطا"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        {/* Price */}
        <FormControl>
          <FormLabel
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            سعر الوجبة <span>{String(price).length}</span>
          </FormLabel>
          <Input
            type="number"
            placeholder="مثال: 5000 / 8000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </FormControl>

        {/* Category */}
        <FormControl>
          <FormLabel>صنف الوجبة</FormLabel>
          <Select
            placeholder="اختر الصنف"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            {categorys.map((cat, index) => (
              <option value={cat.title} key={index}>
                {cat.title}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button
          colorScheme="green"
          isLoading={isLoading}
          onClick={handelCreateMeal}>
          إضافة الوجبة
        </Button>
      </VStack>
    </Box>
  );
}

export default AddMeal;

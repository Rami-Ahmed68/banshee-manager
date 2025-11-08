import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

function AddCategory() {
  return (
    <Box w="100%" h="100%">
      <Heading
        size="lg"
        mb={6}
        borderBottom={"1px solid white"}
        w="98%"
        m="10px 1%">
        إضافة صنف جديد
      </Heading>

      <VStack align="stretch" spacing={4} w="98%" m="0px 1%">
        <FormControl>
          <FormLabel>اسم الصنف</FormLabel>
          <Input placeholder="مثال: وجبات عربية / غربية" />
        </FormControl>
        <Button colorScheme="green">إضافة الصنف</Button>
      </VStack>

      {/* قائمة الأصناف المضافة */}
      <Box mt={10} w="98%" m="10px 1%">
        <Heading size="md" mb={4}>
          الأصناف الحالية:
        </Heading>
      </Box>
    </Box>
  );
}

export default AddCategory;

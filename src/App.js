import { Route, Routes , useLocation } from "react-router-dom";
import Home from "./views/Home";
import SidBar from "./components/global/SidBarComponent";
import { Box  , SlideFade } from "@chakra-ui/react";
import AddMeal from "./views/AddMeal";
import AddCategory from "./views/AddCategory";
import Payments from "./views/Payments";
import DeleteCategoryForm from "./components/category/forms/DeleteForm";
import EditeCategoryForm from "./components/category/forms/EditeForm";
import DeleteMealForm from "./components/meal/forms/DeleteForm";
import EditeMealForm from "./components/meal/forms/EditeForm"
function App() {
  const location = useLocation();

  return (
    <Box className="App"       
      display="flex"
      justifyContent={"space-around"}
      alignItems={"center"}
      dir={"rtl"}>
        <SidBar />
      <Box 
      w="79%"
      h="98vh"
      m="1vh 0%"
      overflowY={"scroll"}
      bg="bg-secondary"
      
      borderRadius={"5px"}>

        <DeleteCategoryForm />
        <EditeCategoryForm />

        <DeleteMealForm />
        <EditeMealForm />
        <SlideFade key={location.pathname} in={true} offsetY="20px">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-meal" element={<AddMeal />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
        </SlideFade>
      </Box>
    </Box>
  );
}

export default App;

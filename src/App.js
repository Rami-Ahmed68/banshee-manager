import { Route, Routes , useLocation } from "react-router-dom";
import Home from "./views/Home";
import SidBar from "./components/global/SidBarComponent";
import { Box  , SlideFade } from "@chakra-ui/react";
import AddMeal from "./views/AddMeal";
import AddCategory from "./views/AddCategory";
function App() {
  const location = useLocation();

  return (
    <Box className="App"       
      display="flex"
      justifyContent={"space-around"}
      alignItems={"center"}>
      <Box 
      w="79%"
      h="98vh"
      m="1vh 0%"
      bg="bg-secondary"
      
      borderRadius={"5px"}>
        <SlideFade key={location.pathname} in={true} offsetY="20px">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-meal" element={<AddMeal />} />
          <Route path="/add-category" element={<AddCategory />} />
        </Routes>
        </SlideFade>
      </Box>
      <SidBar />
    </Box>
  );
}

export default App;

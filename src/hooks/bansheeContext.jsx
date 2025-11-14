import { createContext, useState, useEffect } from "react";

export const BansheeContext = createContext();

export const BansheeProvider = ({ children }) => {
  const [meals, setMeals] = useState(
    () => JSON.parse(window.localStorage.getItem("banshee-meals")) || []
  );

  const [categorys, setCategorys] = useState(
    () => JSON.parse(window.localStorage.getItem("banshee-categories")) || []
  );

  useEffect(() => {
    window.localStorage.setItem("banshee-meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    window.localStorage.setItem(
      "banshee-categories",
      JSON.stringify(categorys)
    );
  }, [categorys]);

  const AddMeal = (mealData) => {
    const date = new Date();
    setMeals([
      ...meals,
      {
        id: meals.length + 1,
        ...mealData,
        created_at: `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`,
        category: mealData.category,
      },
    ]);
  };

  const AddCategory = (categoryData) => {
    const date = new Date();
    setCategorys([
      ...categorys,
      {
        title: categoryData.title,
        id: categorys.length + 1,
        meals: [],
        ...categoryData,
        created_at: `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`,
      },
    ]);
  };

  const value = {
    meals,
    categorys,
    AddCategory,
    AddMeal,
  };

  return (
    <BansheeContext.Provider value={value}>{children}</BansheeContext.Provider>
  );
};

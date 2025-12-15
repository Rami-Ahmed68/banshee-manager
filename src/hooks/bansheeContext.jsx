import { createContext, useState, useEffect } from "react";

export const BansheeContext = createContext();

export const BansheeProvider = ({ children }) => {
  const [meals, setMeals] = useState(
    () => JSON.parse(window.localStorage.getItem("banshee-meals")) || []
  );

  const [categorys, setCategorys] = useState(
    () => JSON.parse(window.localStorage.getItem("banshee-categories")) || []
  );

  const [categorMealsList, setCategorMealsList] = useState([]);

  useEffect(() => {
    window.localStorage.setItem("banshee-meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    window.localStorage.setItem(
      "banshee-categories",
      JSON.stringify(categorys)
    );
  }, [categorys]);

  // const AddMeal = (mealData) => {
  //   const date = new Date();
  //   setMeals([
  //     ...meals,
  //     {
  //       id: meals.length + 1,
  //       ...mealData,
  //       created_at: `${date.getFullYear()}-${
  //         date.getMonth() + 1
  //       }-${date.getDate()}`,
  //       category: mealData.category,
  //     },
  //   ]);
  // };

  const filter_meals = (category_id) => {
    const selected_cat = categorys.find((cat) => cat.id === category_id);

    if (!selected_cat) return;

    const filtered_meals = meals.filter((meal) =>
      selected_cat.meals.includes(meal.id)
    );

    setCategorMealsList(filtered_meals);
  };

  const AddMeal = (mealData) => {
    const date = new Date();

    const newMealId = meals.length + 1;

    const newMeal = {
      id: newMealId,
      ...mealData,
      created_at: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`,
      category: mealData.category,
    };

    setMeals([...meals, newMeal]);

    setCategorys(
      categorys.map((cat) =>
        cat.title === mealData.category
          ? { ...cat, meals: [...cat.meals, newMealId] }
          : cat
      )
    );
  };

  const DeleteMeal = (mealData) => {
    setMeals(meals.filter((meal) => meal.id !== mealData.id));
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
    DeleteMeal,
    categorMealsList,
    setCategorMealsList,
    filter_meals,
  };

  return (
    <BansheeContext.Provider value={value}>{children}</BansheeContext.Provider>
  );
};

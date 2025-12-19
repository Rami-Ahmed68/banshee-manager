import { createContext, useState, useEffect } from "react";

export const BansheeContext = createContext();

const date = new Date();

export const BansheeProvider = ({ children }) => {
  const [meals, setMeals] = useState(
    () => JSON.parse(window.localStorage.getItem("banshee-meals")) || []
  );

  const [categorys, setCategorys] = useState(
    () => JSON.parse(window.localStorage.getItem("banshee-categories")) || []
  );

  const [categorMealsList, setCategorMealsList] = useState([]);

  const [payments, setPayments] = useState(
    () => JSON.parse(window.localStorage.getItem("banshee-payments")) || []
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

  useEffect(() => {
    window.localStorage.setItem("banshee-payments", JSON.stringify(payments));
  }, [payments]);

  const AddPayment = (paymentData) => {
    const newPayment = {
      id: payments.length + 1,
      title: paymentData.title,
      price: paymentData.price,
      description: paymentData.description,
      status: paymentData.status,
      created_at: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`,
    };

    setPayments([...payments, newPayment]);
  };

  const DeletePayment = (payment_id) => {
    const newPaymentsList = payments.filter((pay) => pay.id !== payment_id);
    setPayments(newPaymentsList);
  };

  const ChangePaymentStatus = (payment_id) => {
    const newPaymentList = payments.map((pay) =>
      pay.id === payment_id ? { ...pay, status: !pay.status } : pay
    );

    setPayments(newPaymentList);
  };

  // const AddMeal = (mealData) => {

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
    AddPayment,
    payments,
    DeletePayment,
    ChangePaymentStatus,
  };

  return (
    <BansheeContext.Provider value={value}>{children}</BansheeContext.Provider>
  );
};

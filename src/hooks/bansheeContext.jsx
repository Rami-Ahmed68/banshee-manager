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

  // category's
  const [catForm, setCatForm] = useState(false);
  const [delCatId, setDelCatId] = useState("");

  const [catUpForm, setCatUpForm] = useState(false);
  const [upCatId, setUplCatId] = useState("");
  // category's

  // meal's
  const [mealForm, setMealForm] = useState(false);
  const [delMealId, setDelMealId] = useState("");

  const [mealUpForm, setMealUpForm] = useState(true);
  const [upMealId, setUpMealId] = useState("");
  const [mealUpData, setMealUpData] = useState("");
  // meal's

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

  const filter_meals = (category_id) => {
    console.log(`cat's id ${category_id}`);
    const selected_cat = categorys.find((cat) => cat.id === category_id);

    if (!selected_cat) return;

    const filtered_meals = meals.filter((meal) =>
      selected_cat.meals.includes(meal.id)
    );

    console.log(filtered_meals);

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

  // const DeleteMeal = () => {
  //   setMeals(meals.filter((meal) => meal.id !== delMealId));
  // };

  const DeleteMeal = () => {
    // find the meal by id
    const mealToDelete = meals.find((meal) => meal.id === delMealId);

    // delete the meal
    setMeals(meals.filter((meal) => meal.id !== delMealId));

    // delete the meal's id of category's meals array
    if (mealToDelete && mealToDelete.category) {
      setCategorys((prevCategories) =>
        prevCategories.map((cat) =>
          cat.title === mealToDelete.category
            ? {
                ...cat,
                meals: cat.meals.filter((mealId) => mealId !== delMealId),
              }
            : cat
        )
      );
    }

    // delete the meal of category's meal list
    setCategorMealsList(categorMealsList.filter((ele) => ele.id !== delMealId));
  };

  const UpdateMeal = (data) => {
    try {
      // التحقق من البيانات
      if (!data || !data.id) {
        throw new Error("بيانات غير صالحة للتحديث");
      }

      // إيجاد الوجبة القديمة
      const oldMealIndex = meals.findIndex((meal) => meal.id === data.id);
      if (oldMealIndex === -1) {
        throw new Error("عذرا لم يتم العثور على الوجبة");
      }

      // إنشاء الوجبة المحدثة
      const updatedMeal = {
        ...meals[oldMealIndex], // الحفاظ على الحقول القديمة
        ...data, // إضافة الحقول الجديدة
      };

      // تحديث قائمة الوجبات
      const updatedMeals = meals.map((meal, index) =>
        index === oldMealIndex ? updatedMeal : meal
      );

      // ✅ تحديث meals أولاً
      setMeals(updatedMeals);

      // الآن تحديث categorMealsList
      // 1. إذا كان هناك فئة محددة للفلترة
      if (updatedMeal.category) {
        const foundCategory = categorys.find(
          (cat) => cat.title === updatedMeal.category
        );

        if (foundCategory) {
          // ✅ تحديث categorMealsList بناءً على meals الجديدة
          const filteredMeals = updatedMeals.filter((meal) =>
            foundCategory.meals.includes(meal.id)
          );
          setCategorMealsList(filteredMeals);

          console.log(
            `✅ تم تحديث categorMealsList: ${filteredMeals.length} وجبة`
          );
        }
      }

      // 2. تحديث أيضاً إذا كانت الوجبة في categorMealsList الحالية
      setCategorMealsList((prevList) =>
        prevList.map((meal) =>
          meal.id === data.id ? { ...meal, ...data } : meal
        )
      );

      // إرجاع النتيجة
      return {
        success: true,
        message: "تم تحديث الوجبة بنجاح",
        data: updatedMeal,
      };
    } catch (error) {
      console.error("UpdateMeal error:", error);
      return {
        success: false,
        message: error.message || "عذرا خطأ عام",
      };
    }
  };

  const ChangeDelMealFormStatus = (id) => {
    setDelMealId(id);

    setMealForm(true);
  };

  const ChangeUpMealFormStatus = (id) => {
    setUpMealId(id);

    setMealUpForm(true);

    setMealUpData(meals.filter((meal) => meal.id === id)[0]);
  };

  // categroys
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

  const DeleteCategory = () => {
    // 1. التحقق من وجود الـ ID
    if (!delCatId) {
      console.warn("DeleteCategory: categoryId is required");
      return;
    }

    // 2. حفظ الوجبات المرتبطة بالصنف قبل الحذف (للتأريخ)
    const categoryToDelete = categorys.find((cat) => cat.id === delCatId);
    const associatedMealIds = categoryToDelete?.meals || [];

    // 3. حذف الصنف
    setCategorys((prev) => prev.filter((cat) => cat.id !== delCatId));

    // 4. تنظيف الوجبات المرتبطة بالصنف المحذوف
    if (associatedMealIds.length > 0) {
      setMeals((prev) =>
        prev.filter((meal) => !associatedMealIds.includes(meal.id))
      );
    }

    console.log(`Category ${categoryToDelete?.title} deleted successfully`);
  };

  const ChangeDelCategoryFormStatus = (id) => {
    setDelCatId(id);

    setCatForm(true);
  };

  const UpdateCaytegory = (new_title) => {
    // chking if there a new title or not
    if (!new_title) {
      return Error("يرجى ارسال العنوان الجديد");
    }

    // find the category
    const categoryToUpdate = categorys.find((cat) => cat.id === upCatId);

    if (!categoryToUpdate) {
      return Error("عذرا لا يوجد صنف بهذا المعرف");
    }

    const trimmedTitle = new_title.trim();

    // chek if the name is difrent
    if (categoryToUpdate.title === trimmedTitle) {
      console.log("UpdateCategory: Title unchanged");
      return { success: true, changed: false, message: "No changes" };
    }

    // cheking about duplicate
    const isDuplicate = categorys.some(
      (cat) => cat.id !== upCatId && cat.title === trimmedTitle
    );

    if (isDuplicate) {
      return { success: false, error: "Category name already exists" };
    }

    // update the title
    setCategorys((prev) =>
      prev.map((cat) =>
        cat.id === upCatId ? { ...cat, title: trimmedTitle } : cat
      )
    );

    console.log(
      `UpdateCategory: Updated category ${upCatId} to "${trimmedTitle}"`
    );

    return {
      success: true,
      changed: true,
      oldTitle: categoryToUpdate.title,
      newTitle: trimmedTitle,
    };
  };

  const ChangeUpdateCategoryFormStatus = (id) => {
    setUplCatId(id);

    setCatUpForm(true);
  };
  // categroys

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
    catForm,
    setCatForm,
    DeleteCategory,
    ChangeDelCategoryFormStatus,
    setDelCatId,
    delCatId,
    catUpForm,
    setCatUpForm,
    UpdateCaytegory,
    ChangeUpdateCategoryFormStatus,
    delMealId,
    setDelMealId,
    mealForm,
    setMealForm,
    ChangeDelMealFormStatus,
    mealUpForm,
    setUpMealId,
    upMealId,
    setMealUpForm,
    ChangeUpMealFormStatus,
    mealUpData,
    UpdateMeal,
  };

  return (
    <BansheeContext.Provider value={value}>{children}</BansheeContext.Provider>
  );
};

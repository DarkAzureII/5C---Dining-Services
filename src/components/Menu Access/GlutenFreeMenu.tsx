import React, { useState, useEffect } from 'react';
import { db } from "../../firebaseConfig";
import { doc, getDoc, DocumentReference, DocumentData } from 'firebase/firestore';

// Define the types for weeklyRefs and weeklySchedule
interface WeeklySchedule {
  [key: string]: DocumentReference<DocumentData>[][];
}

const GlutenFreeMenu: React.FC = () => {
  const [breakfastItems, setBreakfastItems] = useState<DocumentData[]>([]);
  const [lunchItems, setLunchItems] = useState<DocumentData[]>([]);
  const [supperItems, setSupperItems] = useState<DocumentData[]>([]);
  const [sideVegetables, setSideVegetables] = useState<DocumentData[]>([]);
  const [drinksItems, setDrinksItems] = useState<DocumentData[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, DocumentData[][]>>({});
  const [loading, setLoading] = useState(true);
  const [showNutritionalInfo, setShowNutritionalInfo] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch Weekly Schedule data here (this part should be the same)
        const weeklyRefs: WeeklySchedule = {
          Sunday: [
            [
              doc(db, 'Menus', 'Gluten-Free Menu','Breakfast-menu', 'Banana Muffins'),
              doc(db, 'Menus', 'Gluten-Free Menu','Breakfast-menu', 'Pancakes'),
              doc(db, 'Menus', 'Gluten-Free Menu','Breakfast-menu', 'French Toast'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Lentil Soup'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Turkey Wrap'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Caesar S'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Beef Dumpling Stew'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Rice and Chicken'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'M Pizza'),
            ]  // Supper
          ],
          Monday: [
            [
              doc(db, 'Menus', 'Gluten-Free Menu','Breakfast-menu', 'Avo Toast'),
              doc(db, 'Menus', 'Gluten-Free Menu','Breakfast-menu', 'Oats'),
              doc(db, 'Menus', 'Gluten-Free Menu','Breakfast-menu', 'Smoothie Bowl'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Q Salad'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Grilled Chicken Wrap'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'GF Pasta'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Rice and Salmon'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Beef Stir-Fry'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Chicken and Quinoa S'),
            ]  // Supper
          ],
          Tuesday: [
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Greek Yoghurt'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Vegan Smoothie'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Pancakes'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Caesar S'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Rice Noodles'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Turkey Wrap'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Roasted Chicken'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Meatballs and Zoodles'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Q Salad'),
            ]  // Supper
          ],
          Wednesday: [
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Omelet Toast'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Waffles'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Chia Pudding'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Grilled Chicken Wrap'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Chicken and Q Salad'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'GF Pasta'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Beef Stir-Fry'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'M Pizza'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Beef Dumpling Stew'),
            ]  // Supper
          ],
          Thursday: [
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Avo Toast'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Greek Yoghurt'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Banana Muffins'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Rice Noodles'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Q Salad'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'BBQ Pizza'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Rice and Chicken'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Chicken Chilli'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Roasted Chicken'),
            ]  // Supper
          ],
          Friday: [
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Oats'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'French Toast'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Waffles'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Greek Salad'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Turkey Wrap'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Chicken and Q Salad'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Grilled Steak'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Meatballs and Zoodles'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Beef Stir-Fry'),
            ]  // Supper
          ],
          Saturday: [
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Vegan Smoothie'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Banana Muffins'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Breakfast-menu', 'Cornflakes'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Rice Noodles'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'BBQ Pizza'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Lunch-menu', 'Lentil Soup'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Q Salad'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Rice and Salmon'),
              doc(db, 'Menus', 'Gluten-Free Menu', 'Supper-menu', 'Chicken Chilli'),
            ]  // Supper
          ],
         
        };

        // Fetch weekly schedule data
        const schedule = await Promise.all(
          Object.keys(weeklyRefs).map(async (day: string) => {
            const mealOptions = await Promise.all(
              weeklyRefs[day].map(async (mealRefs) => {
                const items = await Promise.all(
                  mealRefs.map(async (docRef: DocumentReference<DocumentData>) => {
                    const docSnap = await getDoc(docRef);
                    return docSnap.exists() ? docSnap.data() : null;
                  })
                );
                return items.filter(item => item !== null);
              })
            );
            return { day, mealOptions };
          })
        );

        const weeklyScheduleData = schedule.reduce<Record<string, DocumentData[][]>>((acc, { day, mealOptions }) => {
          acc[day] = mealOptions.map(mealArray =>
            mealArray.filter((item): item is DocumentData => item !== null)
          );
          return acc;
        }, {});

        setWeeklySchedule(weeklyScheduleData);

// Fetch side vegetables (static content)
const sideVegetablesRefs: DocumentReference<DocumentData>[] = [
  doc(db, 'Menus', 'Side-Vegetables', 'Sides', 'Broccoli'),
  doc(db, 'Menus', 'Side-Vegetables', 'Sides', 'Beetroot'),
  doc(db, 'Menus', 'Side-Vegetables', 'Sides', 'CC'),
  doc(db, 'Menus', 'Side-Vegetables', 'Sides', 'Mashed Potatoes'),
  doc(db, 'Menus', 'Side-Vegetables', 'Sides', 'Spinach'),
  doc(db, 'Menus', 'Side-Vegetables', 'Sides', 'Green Beans'),
];

const sideVegetables = await Promise.all(
  sideVegetablesRefs.map(async (docRef: DocumentReference<DocumentData>) => {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  })
);
setSideVegetables(sideVegetables.filter((item): item is DocumentData => item !== null));

// Fetch drinks (static content)
const drinksRefs: DocumentReference<DocumentData>[] = [
  doc(db, 'Menus', 'Drinks-menu', 'Cold Beverages', 'Water'),
  doc(db, 'Menus', 'Drinks-menu', 'Cold Beverages', 'Sparkling Water'),
  doc(db, 'Menus', 'Drinks-menu', 'Cold Beverages', 'Milk'),
  doc(db, 'Menus', 'Drinks-menu', 'Cold Beverages', 'Orange Juice'),
  doc(db, 'Menus', 'Drinks-menu', 'Cold Beverages', 'Apple juice'),
  doc(db, 'Menus', 'Drinks-menu', 'Hot Beverages', 'Tea'),
  doc(db, 'Menus', 'Drinks-menu', 'Hot Beverages', 'Green Tea'),
  doc(db, 'Menus', 'Drinks-menu', 'Hot Beverages', 'Coffee'),
];

const drinksItems = await Promise.all(
  drinksRefs.map(async (docRef: DocumentReference<DocumentData>) => {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  })
);
setDrinksItems(drinksItems.filter((item): item is DocumentData => item !== null));




        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items: ', error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Function to fetch today's menu based on the day of the week
  const fetchTodaysMenu = (dayOfWeek: string) => {
    if (weeklySchedule[dayOfWeek]) {
      setBreakfastItems(weeklySchedule[dayOfWeek][0] || []);
      setLunchItems(weeklySchedule[dayOfWeek][1] || []);
      setSupperItems(weeklySchedule[dayOfWeek][2] || []);
    }
  };

  // Get the current day of the week (e.g., "Sunday", "Monday")
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = daysOfWeek[new Date().getDay()]; // Get current day of the week (0 is Sunday)

  // Update today's menu
  useEffect(() => {
    if (weeklySchedule && today) {
      fetchTodaysMenu(today);
    }
  }, [weeklySchedule, today]);

  if (loading) {
    return <div>Loading...</div>;
  }

 // State to manage nutritional info visibility


// Define the function to toggle nutritional info display
const toggleNutritionalInfo = (index: number) => {
  setShowNutritionalInfo((prevState) => ({
    ...prevState,
    [index]: !prevState[index],  // Toggle the visibility
  }));
};

const renderProduct = (product: DocumentData, index: number) => {
  const { Name, imageUrl, NutritionalInfo, Ingredients, Allergies } = product;

  return (
    <div key={index} className="menu-item relative border rounded shadow-md w-64 h-auto overflow-hidden">
      <div className="flex flex-col h-full">
        <img src={imageUrl} alt={Name} className="w-full h-40 object-cover" />
        <div className="p-2 flex-grow flex flex-col justify-between">
          <h3>Option {index + 1}: {Name}</h3>
          <p><strong>Ingredients:</strong> {Ingredients || 'N/A'}</p>
          <p><strong>Allergies:</strong> {Allergies || 'None'}</p>

          {/* Nutritional Info Toggle */}
          <button
            className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
            onClick={() => toggleNutritionalInfo(index)}
          >
            {showNutritionalInfo[index] ? 'Hide Nutritional Info' : 'Show Nutritional Info'}
          </button>

          {showNutritionalInfo[index] && (
            <div className="nutritional-info mt-2 bg-gray-100 p-2 rounded">
              <h4 className="font-semibold">Nutritional Information:</h4>
              {NutritionalInfo ? (
                <ul>
                  {Object.keys(NutritionalInfo).map((key) => (
                    <li key={key}><strong>{key}:</strong> {NutritionalInfo[key]}</li>
                  ))}
                </ul>
              ) : (
                <p>No nutritional info available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="p-4">
      {/* Today's Menu Display */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Today's Menu(Gluten-Free)</h2>
        <span className="text-lg font-medium">{new Date().toLocaleDateString()}</span>
      </div>

      {/* Breakfast Menu */}
      <h3 className="text-xl font-semibold mt-4 text-center">Breakfast</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {breakfastItems.map((item, index) => renderProduct(item, index))}
      </div>

      {/* Lunch Menu */}
      <h3 className="text-xl font-semibold mt-4 text-center">Lunch</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {lunchItems.map((item, index) => renderProduct(item, index))}
      </div>

      {/* Supper Menu */}
      <h3 className="text-xl font-semibold mt-4 text-center">Supper</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {supperItems.map((item, index) => renderProduct(item, index))}
      </div>

      {/* Side Vegetables and Drinks (static content) */}
      <h3 className="text-xl font-semibold mt-4 text-center">Side Vegetables</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {sideVegetables.map((item, index) => renderProduct(item, index))}
      </div>

      <h3 className="text-xl font-semibold mt-4 text-center">Drinks</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {drinksItems.map((item, index) => renderProduct(item, index))}
      </div>

      {/* Weekly Schedule Table */}
      <h3 className="text-xl font-semibold mt-4 text-center">Weekly Schedule</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {Object.keys(weeklySchedule).map((day) => (
        <div key={day} className="border rounded p-4 shadow-md bg-white">
          <h4 className="font-bold text-center">{day}</h4>
          {weeklySchedule[day].map((mealArray, mealIndex) => (
            <div key={mealIndex} className="mt-2">
              <h5 className="font-semibold">{['Breakfast', 'Lunch', 'Supper'][mealIndex]}</h5>
              <div className="flex flex-wrap justify-center gap-2">
                {mealArray.map((item, index) => (
                  <div key={index} className="w-24 flex flex-col items-center">
                    <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-16 object-cover rounded" />
                    <p className="text-sm text-center">{item.Name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    </div>
  );
};

export default GlutenFreeMenu;

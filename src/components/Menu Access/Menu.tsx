import React, { useState, useEffect } from 'react';
import { db } from "../../firebaseConfig";
import { doc, getDoc, DocumentReference, DocumentData } from 'firebase/firestore';

// Define the types for weeklyRefs and weeklySchedule
interface WeeklySchedule {
  [key: string]: DocumentReference<DocumentData>[][];
}

const Menu: React.FC = () => {
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
              doc(db, 'Menus', 'Main Menu','Breakfast-menu', 'Yoghurt and Mixed Fruits'),
              doc(db, 'Menus', 'Main Menu','Breakfast-menu', 'Oats'),
              doc(db, 'Menus', 'Main Menu','Breakfast-menu', 'Waffles'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Rice and Chicken'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Steak Pie'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Russian Roll'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Spaggheti'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Rice and Salmon'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Pizza and Fries'),
            ]  // Supper
          ],
          Monday: [
            [
              doc(db, 'Menus', 'Main Menu','Breakfast-menu', 'Waffles'),
              doc(db, 'Menus', 'Main Menu','Breakfast-menu', 'Yoghurt and Muesli'),
              doc(db, 'Menus', 'Main Menu','Breakfast-menu', 'Omelet'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Beef Burger'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Chicken Burger'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Turkey Sandwhich'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Rice and Beef Stew'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Roast Beef'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Pap and Chicken'),
            ]  // Supper
          ],
          Tuesday: [
            [
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Bread and Sausage'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Yoghurt and Muesli'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Cornflakes'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Rice and Chicken'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Chicken Sandwhich'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Ribs'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Rice and Salmon'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Mushroom Pizza'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Pap and Chicken'),
            ]  // Supper
          ],
          Wednesday: [
            [
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Cheese Toast'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Oats'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Pancakes'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Russian Roll'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Chicken Wrap'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Stir-Fry'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Rice and Beef Stew'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Pizza and Fries'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Roast Beef'),
            ]  // Supper
          ],
          Thursday: [
            [
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Bread and Sausage'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Smoothie Bowl'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Cornflakes'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Chicken Burger'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Rice and Chicken'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Chicken Wrap'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Pap and Chicken'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Mushroom Pizza'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Chicken Wrap'),
            ]  // Supper
          ],
          Friday: [
            [
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Cheese Toast'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Waffles'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Omelet'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Stir-Fry'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Turkey Sandwhich'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Beef Burger'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Rice and Salmon'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Spaggheti'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Mushroom Pizza'),
            ]  // Supper
          ],
          Saturday: [
            [
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Omelet'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Yoghurt and Mixed Fruits'),
              doc(db, 'Menus', 'Main Menu', 'Breakfast-menu', 'Pancakes'),
            ], // Breakfast
            [
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Beef Burger'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Ribs'),
              doc(db, 'Menus', 'Main Menu', 'Lunch-menu', 'Chicken Sandwhich'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Rice and Beef Stew'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu','Pizza and Fries'),
              doc(db, 'Menus', 'Main Menu', 'Supper-menu', 'Chicken Wrap'),
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
        <h2 className="text-2xl font-bold">Today's Menu(Main)</h2>
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
      <table className="table-auto w-full mt-4 border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Day</th>
            <th className="border px-4 py-2">Breakfast</th>
            <th className="border px-4 py-2">Lunch</th>
            <th className="border px-4 py-2">Supper</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(weeklySchedule).map((day: string) => (
            <tr key={day}>
              <td className="border px-4 py-2 text-center font-bold">{day}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-2">
                  {weeklySchedule[day][0].map((item: DocumentData, index: number) => (
                    <div key={index} className="w-24">
                      <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-16 object-cover rounded" />
                      <p className="text-sm text-center">{item.Name}</p>
                    </div>
                  ))}
                </div>
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-2">
                  {weeklySchedule[day][1].map((item: DocumentData, index: number) => (
                    <div key={index} className="w-24">
                      <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-16 object-cover rounded" />
                      <p className="text-sm text-center">{item.Name}</p>
                    </div>
                  ))}
                </div>
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-2">
                  {weeklySchedule[day][2].map((item: DocumentData, index: number) => (
                    <div key={index} className="w-24">
                      <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-16 object-cover rounded" />
                      <p className="text-sm text-center">{item.Name}</p>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu;

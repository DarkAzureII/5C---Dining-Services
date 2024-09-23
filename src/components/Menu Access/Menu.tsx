import React, { useState, useEffect } from 'react';
import {db} from "./menuFirebaseConfig"
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

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch today's Breakfast items
        const breakfastRefs: DocumentReference<DocumentData>[] = [
          doc(db, 'Menus', 'Breakfast-menu', 'Bread,Eggs,Sausage', 'Oklmv1HXNIKfFYcWZVzG'),
          doc(db, 'Menus', 'Breakfast-menu', 'Yoghurt, Muesli', 'zycvHoOm9tD5XowVM93C'),
          doc(db, 'Menus', 'Breakfast-menu', 'Cornflakes', 'SCeFwbC7FstaXOUlSTkv')
        ];

        const breakfastItems = await Promise.all(
          breakfastRefs.map(async (docRef: DocumentReference<DocumentData>) => {
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
          })
        );
        setBreakfastItems(
          breakfastItems
            .filter((item): item is DocumentData => item !== null) // Type guard to assert non-null items
        );

        // Fetch today's Lunch items
        const lunchRefs: DocumentReference<DocumentData>[] = [
          doc(db, 'Menus', 'Lunch-Menu', 'Rice, Chicken and Side vegetable', 'VxW9yXE8mHT7UXX7L7io'),
          doc(db, 'Menus', 'Lunch-Menu', 'Chicken Wrap', 'Z4aMbhDvysBw4hWuXhKg'),
          doc(db, 'Menus', 'Lunch-Menu', 'Ribs', 'OoBLLa9tpJI5zn3Q7l3g')
        ];

        const lunchItems = await Promise.all(
          lunchRefs.map(async (docRef: DocumentReference<DocumentData>) => {
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
          })
        );
        setLunchItems(lunchItems.filter((item): item is DocumentData => item !== null));

        // Fetch today's Supper items
        const supperRefs: DocumentReference<DocumentData>[] = [
          doc(db, 'Menus', 'Supper-menu', 'Rice and Salmon', 'x2AYHgBhuauqdRU6rZTE'),
          doc(db, 'Menus', 'Supper-menu', 'Vegan Pizza', 'f8wECEgfVk3WCteD0aZR'),
          doc(db, 'Menus', 'Supper-menu', 'Pap, Chicken and Side Vegetable', '5FO5cftHOarmAWAh1yru')
        ];

        const supperItems = await Promise.all(
          supperRefs.map(async (docRef: DocumentReference<DocumentData>) => {
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
          })
        );
        setSupperItems(supperItems.filter((item): item is DocumentData => item !== null));

        // Fetch today's Side Vegetables items
        const sideVegetablesRefs: DocumentReference<DocumentData>[] = [
          doc(db, 'Menus', 'Side-Vegetables', 'Mash', 'oPQOO8D9IFr58xhNgr9p'),
          doc(db, 'Menus', 'Side-Vegetables', 'Brocolli', 'xtC4dUGncbNHdYpjeVyY'),
          doc(db, 'Menus', 'Side-Vegetables', 'Carrots', 'B3hxsUj8VZZm6qL9q9Vl'),
          doc(db, 'Menus', 'Side-Vegetables', 'Beetroot', 'FAq2Mwp1u6QBpd2cIwA6'),
          doc(db, 'Menus', 'Side-Vegetables', 'Grean Beans', 'uGUcbdEPsaCvo1ZZJhkL'),
          doc(db, 'Menus', 'Side-Vegetables', 'Spinach', 'YqiIesHzOoEPbkhmCLf8')
        ];

        const sideVegetables = await Promise.all(
          sideVegetablesRefs.map(async (docRef: DocumentReference<DocumentData>) => {
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
          })
        );
        setSideVegetables(sideVegetables.filter((item): item is DocumentData => item !== null));

        // Fetch today's Drinks items
        const drinksRefs: DocumentReference<DocumentData>[] = [
          doc(db, 'Menus', 'Drinks-menu', 'Apple Juice', 'IfDUagiJAnNxYWu2XGW6'),
          doc(db, 'Menus', 'Drinks-menu', 'Orange Juice', '71qZk5S3NjueKvAmw6Gn'),
          doc(db, 'Menus', 'Drinks-menu', 'Tea', 'tGEKQHCU8cqzOGcebpG9'),
          doc(db, 'Menus', 'Drinks-menu', 'Coffee', 'PGdaqAUswbeSeTivt8iS'),
          doc(db, 'Menus', 'Drinks-menu', 'Green Tea', '21IQfqTdJHV7cFHPD5ZX'),
          doc(db, 'Menus', 'Drinks-menu', 'Milk', '8aalq6ratQ0B0yXd3rD9')
        ];

        const drinksItems = await Promise.all(
          drinksRefs.map(async (docRef: DocumentReference<DocumentData>) => {
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
          })
        );
        setDrinksItems(drinksItems.filter((item): item is DocumentData => item !== null));

        // Fetch Weekly Schedule (Breakfast, Lunch, and Supper for each day)
        const weeklyRefs: WeeklySchedule = {
          Sunday: [
            [
              doc(db, 'Menus', 'Breakfast-menu', 'Yoghurt and Mixed fruits', 'k0lmksbdmBfaxpSjGgRm'),
          doc(db, 'Menus', 'Breakfast-menu', 'Oats', 'grbdpuQiyYHA9lQJ5jip'),
          doc(db, 'Menus', 'Breakfast-menu', 'Tofu Scamble', 'f89RYz2paNO4n67CnODb')
            ], // Breakfast
            [
              doc(db, 'Menus', 'Lunch-Menu', 'Rice, Chicken and Side vegetable', 'VxW9yXE8mHT7UXX7L7io'),
              doc(db, 'Menus', 'Lunch-Menu', 'Veggie Burger', 'XOwg2cPFtgRJkJEibYIR'),
             doc(db, 'Menus', 'Lunch-Menu', 'Russian roll and Fries', '7Qk6D0PR6zKHdFtsIiOU')
            ], // Lunch
            [
              doc(db, 'Menus', 'Supper-menu', 'Spaghetti', 'VEdvOxHQ077O6x3NtS4l'),
              doc(db, 'Menus', 'Supper-menu', 'Rice and Salmon', 'x2AYHgBhuauqdRU6rZTE'),
              doc(db, 'Menus', 'Supper-menu', 'Pizza and Fries', 'xusGFGD8isegkrB59U8O')
            ]  // Supper
          ],
          Monday: [
            [
              doc(db, 'Menus', 'Breakfast-menu', 'Waffles', 'EPyE3wHkBdUwIkuItPrf'),
          doc(db, 'Menus', 'Breakfast-menu', 'Yoghurt, Muesli', 'zycvHoOm9tD5XowVM93C'),
          doc(db, 'Menus', 'Breakfast-menu', 'Omelet', 'Tf6ENJfH62t5b4YDKFVb')
            ], // Breakfast
            [
              doc(db, 'Menus', 'Lunch-Menu', 'Beef Burger', 'IfptUXJJHkFOwuxJdpDs'),
              doc(db, 'Menus', 'Lunch-Menu', 'Burger and Fries', 'jM0zOS7Fw95lyGZjRRd5'),
             doc(db, 'Menus', 'Lunch-Menu', 'Turkey Sandwhich', 'QlV9mvw2KGwbRerLaBtc')
            ], // Lunch
            [
              doc(db, 'Menus', 'Supper-menu', 'Rice and Beef Stew', '84uYqbGJgXmOHQ5cl91q'),
              doc(db, 'Menus', 'Supper-menu', 'Veggie Wrap', 'bHnygNa6Nqi8fg2pXmD3'),
              doc(db, 'Menus', 'Supper-menu', 'Pap, Chicken and Side Vegetable', '5FO5cftHOarmAWAh1yru')
            ]  // Supper
          ],
          Tuesday: [
            [
              doc(db, 'Menus', 'Breakfast-menu', 'Bread,Eggs,Sausage', 'Oklmv1HXNIKfFYcWZVzG'),
          doc(db, 'Menus', 'Breakfast-menu', 'Yoghurt, Muesli', 'zycvHoOm9tD5XowVM93C'),
          doc(db, 'Menus', 'Breakfast-menu', 'Cornflakes', 'SCeFwbC7FstaXOUlSTkv')
            ], // Breakfast
            [
              doc(db, 'Menus', 'Lunch-Menu', 'Rice, Chicken and Side vegetable', 'VxW9yXE8mHT7UXX7L7io'),
              doc(db, 'Menus', 'Lunch-Menu', 'Chicken Wrap', 'Z4aMbhDvysBw4hWuXhKg'),
              doc(db, 'Menus', 'Lunch-Menu', 'Ribs', 'OoBLLa9tpJI5zn3Q7l3g')
            ], // Lunch
            [
              doc(db, 'Menus', 'Supper-menu', 'Rice and Salmon', 'x2AYHgBhuauqdRU6rZTE'),
              doc(db, 'Menus', 'Supper-menu', 'Vegan Pizza', 'f8wECEgfVk3WCteD0aZR'),
              doc(db, 'Menus', 'Supper-menu', 'Pap, Chicken and Side Vegetable', '5FO5cftHOarmAWAh1yru')
            ]  // Supper
          ],
          Wednesday: [
            [
              doc(db, 'Menus', 'Breakfast-menu', 'Cheese Toast', 'lrCWbpldgk7KmCWJSNtf'),
          doc(db, 'Menus', 'Breakfast-menu', 'Oats', 'grbdpuQiyYHA9lQJ5jip'),
          doc(db, 'Menus', 'Breakfast-menu', 'Pancakes', 'JKv0clsFMvu0X7JqZpTF')
            ], // Breakfast
            [
              doc(db, 'Menus', 'Lunch-Menu', 'Russian roll and Fries', '7Qk6D0PR6zKHdFtsIiOU'),
              doc(db, 'Menus', 'Lunch-Menu', 'Veggie Burger', 'XOwg2cPFtgRJkJEibYIR'),
              doc(db, 'Menus', 'Lunch-Menu', 'Stir-Fry', 'yZWRZf6EpwFw81BQCMrl')
            ], // Lunch
            [
              doc(db, 'Menus', 'Supper-menu', 'Rice and Beef Stew', '84uYqbGJgXmOHQ5cl91q'),
              doc(db, 'Menus', 'Supper-menu', 'Pizza and Fries', 'xusGFGD8isegkrB59U8O'),
              doc(db, 'Menus', 'Supper-menu', 'Veggie Wrap', 'bHnygNa6Nqi8fg2pXmD3')
            ]  // Supper
          ],
          Thursday: [
            [
              doc(db, 'Menus', 'Breakfast-menu', 'Bread,Eggs,Sausage', 'Oklmv1HXNIKfFYcWZVzG'),
          doc(db, 'Menus', 'Breakfast-menu', 'Smoothie Bowl', 'h8nQk3oOMKx77mypFfcL'),
          doc(db, 'Menus', 'Breakfast-menu', 'Cornflakes', 'SCeFwbC7FstaXOUlSTkv')
            ], // Breakfast
            [
              doc(db, 'Menus', 'Lunch-Menu', 'Burger and Fries', 'jM0zOS7Fw95lyGZjRRd5'),
              doc(db, 'Menus', 'Lunch-Menu', 'Chicken Wrap', 'Z4aMbhDvysBw4hWuXhKg'),
              doc(db, 'Menus', 'Lunch-Menu', 'Rice, Chicken and Side vegetable', 'VxW9yXE8mHT7UXX7L7io'),
            ], // Lunch
            [
              doc(db, 'Menus', 'Supper-menu', 'Pap, Chicken and Side Vegetable', '5FO5cftHOarmAWAh1yru'),
              doc(db, 'Menus', 'Supper-menu', 'Vegan Pizza', 'f8wECEgfVk3WCteD0aZR'),
              doc(db, 'Menus', 'Supper-menu', 'Mushroom Pizza', 'Q9rQVPF2pMpJrORkGIKW')
            ]  // Supper
          ],
          Friday: [
            [
              doc(db, 'Menus', 'Breakfast-menu', 'Cheese Toast', 'lrCWbpldgk7KmCWJSNtf'),
          doc(db, 'Menus', 'Breakfast-menu', 'Waffles', 'EPyE3wHkBdUwIkuItPrf'),
          doc(db, 'Menus', 'Breakfast-menu', 'Tofu Scamble', 'f89RYz2paNO4n67CnODb')
            ], // Breakfast
            [
              doc(db, 'Menus', 'Lunch-Menu', 'Stir-Fry', 'yZWRZf6EpwFw81BQCMrl'),
              doc(db, 'Menus', 'Lunch-Menu', 'Veggie Burger', 'XOwg2cPFtgRJkJEibYIR'),
              doc(db, 'Menus', 'Lunch-Menu', 'Turkey Sandwhich', 'QlV9mvw2KGwbRerLaBtc')
            ], // Lunch
            [
              doc(db, 'Menus', 'Supper-menu', 'Rice and Salmon', 'x2AYHgBhuauqdRU6rZTE'),
              doc(db, 'Menus', 'Supper-menu', 'Mushroom Pizza', 'Q9rQVPF2pMpJrORkGIKW'),
              doc(db, 'Menus', 'Supper-menu', 'Spaghetti', 'VEdvOxHQ077O6x3NtS4l')
            ]  // Supper
          ],
          Saturday: [
            [
              doc(db, 'Menus', 'Breakfast-menu', 'Omelet', 'Tf6ENJfH62t5b4YDKFVb'),
          doc(db, 'Menus', 'Breakfast-menu', 'Yoghurt and Mixed fruits', 'k0lmksbdmBfaxpSjGgRm'),
          doc(db, 'Menus', 'Breakfast-menu', 'Pancakes', 'JKv0clsFMvu0X7JqZpTF')
            ], // Breakfast
            [
               doc(db, 'Menus', 'Lunch-Menu', 'Beef Burger', 'IfptUXJJHkFOwuxJdpDs'),
               doc(db, 'Menus', 'Lunch-Menu', 'Chicken Wrap', 'Z4aMbhDvysBw4hWuXhKg'),
               doc(db, 'Menus', 'Lunch-Menu', 'Ribs', 'OoBLLa9tpJI5zn3Q7l3g')
            ], // Lunch
            [
              doc(db, 'Menus', 'Supper-menu', 'Veggie Wrap', 'bHnygNa6Nqi8fg2pXmD3'),
              doc(db, 'Menus', 'Supper-menu', 'Rice and Beef Stew', '84uYqbGJgXmOHQ5cl91q'),
              doc(db, 'Menus', 'Supper-menu', 'Pizza and Fries', 'xusGFGD8isegkrB59U8O')
            ]  // Supper
          ],
          // Add other days similarly...
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
          // Filter out `null` values from `mealOptions` and ensure it's of type `DocumentData[][]`
          const filteredMealOptions = mealOptions.map(mealArray =>
            mealArray.filter((item): item is DocumentData => item !== null)
          );
          
          acc[day] = filteredMealOptions;
          return acc;
        }, {});
        
        setWeeklySchedule(weeklyScheduleData);
        

        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items: ', error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Today's Menu Display */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Today's Menu</h2>
        <span className="text-lg font-medium">{new Date().toLocaleDateString()}</span>
      </div>

      {/* Breakfast Menu */}
      <h3 className="text-xl font-semibold mt-4 text-center">Breakfast</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {breakfastItems.map((item, index) => {
          const nutritionalInfo = item.nutritionalInfo || [];
          const calories = nutritionalInfo[0] || 'N/A';
          const proteins = nutritionalInfo[1] || 'N/A';
          const fats = nutritionalInfo[2] || 'N/A';
          const carbohydrates = nutritionalInfo[3] || 'N/A';

          return (
            <div key={index} className="relative w-64 p-2 border rounded shadow-md">
              <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-medium">Option {index + 1}: {item.Name}</h4>
              <div className="mt-2 text-center">
                <p>Calories: {calories}</p>
                <p>Proteins: {proteins}</p>
                <p>Fats: {fats}</p>
                <p>Carbohydrates: {carbohydrates}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lunch Menu */}
      <h3 className="text-xl font-semibold mt-4 text-center">Lunch</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {lunchItems.map((item, index) => {
          const nutritionalInfo = item.nutritionalInfo || [];
          const calories = nutritionalInfo[0] || 'N/A';
          const proteins = nutritionalInfo[1] || 'N/A';
          const fats = nutritionalInfo[2] || 'N/A';
          const carbohydrates = nutritionalInfo[3] || 'N/A';

          return (
            <div key={index} className="relative w-64 p-2 border rounded shadow-md">
              <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-medium">Option {index + 1}: {item.Name}</h4>
              <div className="mt-2 text-center">
                <p>Calories: {calories}</p>
                <p>Proteins: {proteins}</p>
                <p>Fats: {fats}</p>
                <p>Carbohydrates: {carbohydrates}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Supper Menu */}
      <h3 className="text-xl font-semibold mt-4 text-center">Supper</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {supperItems.map((item, index) => {
          const nutritionalInfo = item.nutritionalInfo || [];
          const calories = nutritionalInfo[0] || 'N/A';
          const proteins = nutritionalInfo[1] || 'N/A';
          const fats = nutritionalInfo[2] || 'N/A';
          const carbohydrates = nutritionalInfo[3] || 'N/A';

          return (
            <div key={index} className="relative w-64 p-2 border rounded shadow-md">
              <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-medium">Option {index + 1}: {item.Name}</h4>
              <div className="mt-2 text-center">
                <p>Calories: {calories}</p>
                <p>Proteins: {proteins}</p>
                <p>Fats: {fats}</p>
                <p>Carbohydrates: {carbohydrates}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Side Vegetables */}
      <h3 className="text-xl font-semibold mt-4 text-center">Side Vegetables</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {sideVegetables.map((item, index) => {
          const nutritionalInfo = item.nutritionalInfo || [];
          const calories = nutritionalInfo[0] || 'N/A';
          const proteins = nutritionalInfo[1] || 'N/A';
          const fats = nutritionalInfo[2] || 'N/A';
          const carbohydrates = nutritionalInfo[3] || 'N/A';

          return (
            <div key={index} className="relative w-64 p-2 border rounded shadow-md">
              <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-medium">Option {index + 1}: {item.Name}</h4>
              <div className="mt-2 text-center">
                <p>Calories: {calories}</p>
                <p>Proteins: {proteins}</p>
                <p>Fats: {fats}</p>
                <p>Carbohydrates: {carbohydrates}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Drinks */}
        <h3 className="text-xl font-semibold mt-4 text-center">Drinks</h3>
      <div className="flex justify-center gap-4 overflow-x-auto">
        {drinksItems.map((item, index) => {
          const nutritionalInfo = item.nutritionalInfo || [];
          const calories = nutritionalInfo[0] || 'N/A';
          const proteins = nutritionalInfo[1] || 'N/A';
          const fats = nutritionalInfo[2] || 'N/A';
          const carbohydrates = nutritionalInfo[3] || 'N/A';

          return (
            <div key={index} className="relative w-64 p-2 border rounded shadow-md">
              <img src={item.imageUrl || '/defaultImage.jpg'} alt={item.Name} className="w-full h-40 object-cover rounded" />
              <h4 className="text-lg font-medium">Option {index + 1}: {item.Name}</h4>
              <div className="mt-2 text-center">
                <p>Calories: {calories}</p>
                <p>Proteins: {proteins}</p>
                <p>Fats: {fats}</p>
                <p>Carbohydrates: {carbohydrates}</p>
              </div>
            </div>
          );
        })}
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

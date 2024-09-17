import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

//import firebase and setup database connection.
//import { db } from './firebaseConfig';

interface Order {
  id: string;
  restaurant: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  completed: boolean;
  rating?: number;
  feedback?: string;
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    //Mock items
    {
      id: '123',
      restaurant: 'Pizza Place',
      date: '2024-09-14',
      items: [
        { name: 'Pepperoni Pizza', quantity: 1, price: 12.99 },
        { name: 'Garlic Bread', quantity: 2, price: 3.99 }
      ],
      totalPrice: 20.97,
      completed: true,
      rating: 4,
      feedback: 'Great food!'
    },
    {
      id: '124',
      restaurant: 'Burger House',
      date: '2024-09-13',
      items: [
        { name: 'Cheeseburger', quantity: 2, price: 8.99 },
        { name: 'Fries', quantity: 1, price: 2.99 }
      ],
      totalPrice: 20.97,
      completed: true
    } 
  ]);

  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const completedOrders = orders.filter(order => order.completed);

  /*useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders'); // Reference to the 'orders' collection
        const orderSnapshot = await getDocs(ordersCollection); // Fetch the orders
        const ordersList = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[]; // Map through documents and extract data
        setOrders(ordersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); */


  const toggleExpanded = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const handleRatingChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    orderId: string
  ) => {
    const newRating = Number(e.target.value);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, rating: newRating } : order
      )
    );
  };

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    orderId: string
  ) => {
    const newFeedback = e.target.value;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, feedback: newFeedback } : order
      )
    );
  };

  const handleSubmitReview = async (orderId: string) => {;
    const order = orders.find((o) => o.id === orderId);
      if (!order?.rating || !order?.feedback) {
      alert("Please fill in both rating and feedback.");
      return;
    }

    setLoading(true); // Start loading

    /*try {
      // Save the review in Firestore
      await db.collection('orders').add({
        orderId: order.id,
        restaurant: order.restaurant,
        rating: order.rating,
        feedback: order.feedback,
        date: new Date(),
      }); */

      // Update the local order state to indicate review has been submitted
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, rating: order.rating, feedback: order.feedback } : o
        )
      );

     /* alert('Review submitted successfully!');
    } catch (error) {
      console.error("Error submitting review: ", error);
      alert('Failed to submit review.');
    } finally {
      setLoading(false); // Stop loading
    } */
  };

  const handleReorder = (orderId: string) => {
    // Logic for reordering, this could trigger adding the same items to the cart
    console.log(`Reordering items for order ${orderId}`);
  };

  const handleStartOrdering = () => {
    navigate('/dashboard'); 
  };

  return (
    <div className="p-5 bg-gray- min-h-screen">
      {/* Back Arrow and order history text*/}
      <div className="flex items-center justify-normal mb-5" >
      <button
        className="text-blue-500 font-semibold flex items-start mr-30 mb-5"
        style={{ color: '#0c0d43' }}
        onClick={() => navigate('/dashboard?tab=menuAccess')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Order History text centered */}
      <h1 className="text-3xl font-bold  mb-5"
      style={{color: '#0c0d43' }}>Order History</h1>
      </div>

      {/* Conditional rendering: Show clipboard icon if there are no orders */}
      {completedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          {/* Clipboard Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-24 h-24 text-gray-400 mb-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2h6v2a2 2 0 002 2h1a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1a2 2 0 002-2V2zm0 0h6" />
          </svg>
          {/* No history text */}
          <h1 className="text-gray-500  font-semibold">No history yet</h1>
          <p className="text-gray-500  font-semibold mb-15">Click the button below to start ordering</p>

          {/* Start Ordering Button */}
          <button
          onClick={handleStartOrdering}
          className="mt-5 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 "
          style={{ backgroundColor: '#0c0d43', width: '250px' }} 
          >
          Start Ordering
          </button>
        </div>
      ) : (
        /* Cards in vertical layout */
        <div className="flex flex-col space-y-4">
          {completedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-100 shadow-md rounded-xl p-4 transition transform hover:scale-105 cursor-pointer mb-7"
            >
              {/* Card Summary */}

              <div onClick={() => toggleExpanded(order.id)} className="cursor-pointer">
                <div className="flex items-normal space-x-4">
                  {/* Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-500 rounded-full mr-3">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Restaurant"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  {/* Restaurant Name and Info */}
                  <div>
                    <h2 className="text-2xl font-semibold">{order.restaurant}</h2>
                    <p className="text-gray-400">
                      {order.items.length} items - R{order.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-gray-400">Ordered on: {order.date}</p>
                    <p className="text-green-400">Completed</p>
                  </div>
                </div>
              </div>


               {/* Expanded Order Details */}
               {expandedOrder === order.id && (
                <div className="mt-5">
                 {/* Separator */}
                  <hr className="my-4 border-gray-600" />
                  <h3 className="text-xl font-bold">Order Details</h3>
                  <ul className="list-disc ml-5">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity} x {item.name} - R{item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                 {/* Separator */}
                 <hr className="my-4 border-gray-600" />
                  <div className="mt-3">
                    <h4 className="text-lg font-semibold">Review</h4>
                    
                    {/* Show review if already submitted, otherwise show form */}
                    {order.rating && order.feedback ? (
                      <div className="mt-2">
                        <p><strong>Rating:</strong> {order.rating} Stars</p>
                        <p><strong>Review:</strong> {order.feedback}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setReviewingOrder(
                            reviewingOrder === order.id ? null : order.id
                          )
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-3 hover:bg-blue-600"
                      >
                        {reviewingOrder === order.id
                          ? 'Cancel Review'
                          : 'Leave a Review'}
                      </button>
                    )}

                    {/* Conditionally show the review form */}
                    {reviewingOrder === order.id && (
                      <div className="mt-3">
                        <label className="block text-md">Rating: </label>
                        <select
                          value={order.rating || ''}
                          onChange={(e) => handleRatingChange(e, order.id)}
                          className="border p-2 rounded w-full"
                        >
                          <option value="">Select Rating</option>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} Star{num > 1 ? 's' : ''}
                            </option>
                          ))}
                        </select>

                        <div className="mt-3">
                          <label className="block text-md">Feedback: </label>
                          <textarea
                            value={order.feedback || ''}
                            onChange={(e) => handleFeedbackChange(e, order.id)}
                            className="border p-2 w-full rounded"
                            rows={3}
                            maxLength={1000}
                          />
                          <p className="text-sm text-gray-500">
                            {1000 - (order.feedback?.length || 0)} characters left
                          </p>

                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-3 hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubmitReview(order.id);
                            }}
                            disabled={loading || !order.rating || !order.feedback}
                          >
                            {loading ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order.id);
                      }}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                        //style={{backgroundColor: '#0c0d43' }}
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                //</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default OrderHistory;
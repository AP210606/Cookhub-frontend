// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ContactList = () => {
//   const [messages, setMessages] = useState([]);
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/contact/admin', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };
//     fetchMessages();
//   }, [token]);

//   const handleViewDetails = (id) => {
//     navigate(`/contact/${id}`);
//   };

//   return (
//     <div>
//       <h2>Admin Contact Messages</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Message</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {messages.map((message) => (
//             <tr key={message._id}>
//               <td>{message.fullName}</td>
//               <td>{message.email}</td>
//               <td>{message.message.substring(0, 50)}...</td>
//               <td><button onClick={() => handleViewDetails(message._id)}>View Details</button></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ContactList;
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const ContactDetails = () => {
//   const { id } = useParams();
//   const [message, setMessage] = useState(null);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchMessageDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/contact/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setMessage(response.data);
//       } catch (error) {
//         console.error('Error fetching message details:', error);
//       }
//     };
//     fetchMessageDetails();
//   }, [id, token]);

//   if (!message) return <div>Loading...</div>;

//   return (
//     <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd' }}>
//       <h2>Contact Message Details</h2>
//       <div style={{ margin: '20px 0' }}>
//         <h3>Your Details</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr><td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>Name:</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{message.fullName}</td></tr>
//             <tr><td>Email:</td><td><a href={`mailto:${message.email}`}>{message.email}</a></td></tr>
//             <tr><td>Mobile Number:</td><td>{message.mobileNumber || 'N/A'}</td></tr>
//             <tr><td>Message Type:</td><td>{message.messageType || 'N/A'}</td></tr>
//             <tr><td>Message:</td><td>{message.message}</td></tr>
//           </tbody>
//         </table>
//       </div>
//       <div style={{ margin: '20px 0' }}>
//         <h3>Address Details</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr><td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>Address:</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{message.address || 'N/A'}</td></tr>
//             <tr><td>City:</td><td>{message.city || 'N/A'}</td></tr>
//             <tr><td>State:</td><td>{message.state || 'N/A'}</td></tr>
//             <tr><td>Pin Code:</td><td>{message.pinCode || 'N/A'}</td></tr>
//           </tbody>
//         </table>
//       </div>
//       <div style={{ margin: '20px 0' }}>
//         <h3>Additional Information</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr><td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>Payment Details:</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{message.paymentDetails || 'N/A'}</td></tr>
//             <tr><td>Preferred Contact Time:</td><td>{message.preferredTime || 'N/A'}</td></tr>
//           </tbody>
//         </table>
//       </div>
//       <div style={{ margin: '20px 0' }}>
//         <h3>Payment Receipt</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <tbody>
//             <tr><td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>Amount:</td><td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{message.paymentAmount || 'N/A'}</td></tr>
//             <tr><td>Transaction ID:</td><td>{message.transactionId || 'N/A'}</td></tr>
//             <tr><td>Payment Date:</td><td>{message.paymentDate ? new Date(message.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}</td></tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ContactDetails;
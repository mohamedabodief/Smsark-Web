// import React, { useState, useEffect } from 'react';
// import registerWithEmailAndPassword from './FireBase/authService/registerWithEmailAndPassword';
// import loginWithEmailAndPassword from './FireBase/authService/loginWithEmailAndPassword';
// import { logout } from './FireBase/authService/logout'; // 🔥 الاستيراد الجديد
// import User from './FireBase/modelsWithOperations/User';
// import Property from './FireBase/ModelsWithOperations/Property';
// import FinancingOffer from './FireBase/ModelsWithOperations/FinancingOffer';

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [usersList, setUsersList] = useState([]);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const snapshot = await User.getAllUsers();
//       setUsersList(snapshot);
//     };
//     fetchUsers();
//   }, []);

//   const handleRegister = async () => {
//     const result = await registerWithEmailAndPassword(email, password);
//     if (result.success) {
//       const newUser = new User(
//         result.uid,
//         'client',
//         'Test User',
//         '0100000000',
//         'image.png'
//       );
//       await newUser.saveToFirestore();
//       setCurrentUser(newUser);
//     } else {
//       alert(result.error);
//     }
//   };

//   const handleLogin = async () => {
//     const result = await loginWithEmailAndPassword(email, password);
//     if (result.success) {
//       const fetchedUser = await User.getByUid(result.uid);
//       setCurrentUser(fetchedUser);
//     } else {
//       alert(result.error);
//     }
//   };

//   const handleLogout = async () => {
//     const result = await logout();
//     if (result.success) {
//       setCurrentUser(null);
//       setEmail('');
//       setPassword('');
//       alert('✅ تم تسجيل الخروج بنجاح');
//     } else {
//       alert(`❌ خطأ أثناء الخروج: ${result.error}`);
//     }
//   };

//   const addDummyProperty = async () => {
//     if (!currentUser) return;
//     const prop = new Property(
//       'property-id',
//       'شقة رائعة',
//       500000,
//       ['image.png'],
//       currentUser.uid
//     );
//     await prop.save();
//     alert('تم إضافة العقار بنجاح');
//   };

//   const addDummyFinancing = async () => {
//     if (!currentUser) return;
//     const offer = new FinancingOffer(
//       'offer-id',
//       'عرض تمويل مميز',
//       'وصف مبسط',
//       'مرن',
//       'image.png',
//       '0100000000',
//       { start: 10000, end: 500000 },
//       'شركة تمويل',
//       'organization',
//       currentUser.uid
//     );
//     await offer.saveToFirestore();
//     alert('تم إضافة التمويل بنجاح');
//   };

//   return (
//     <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
//       <h1>Test App</h1>

//       {!currentUser ? (
//         <div style={{ marginBottom: '1rem' }}>
//           <h2>Login or Register</h2>
//           <input
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//           />
//           <input
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//             type="password"
//           />
//           <button onClick={handleLogin}>Login</button>
//           <button onClick={handleRegister}>Register</button>
//         </div>
//       ) : (
//         <div style={{ marginBottom: '1rem' }}>
//           <h2>Welcome, {currentUser.name}</h2>
//           <button onClick={handleLogout}>Logout</button> {/* 🔥 زر الخروج */}
//           <button onClick={addDummyProperty}>Add Dummy Property</button>
//           <button onClick={addDummyFinancing}>Add Dummy Financing</button>
//         </div>
//       )}

//       <h2>All Users:</h2>
//       <ul>
//         {usersList.map((u) => (
//           <li key={u.uid}>{u.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
import React from 'react'
import CardSearch from './searchCompoents/CardSearch'
import SearchPage from './pages/SearchPage'

function App() {
  return (
   <>
 <SearchPage/>
   </>
  )
}

export default App

// src/TestAuth.jsx
import React, { useState } from 'react';
import registerWithEmailAndPassword from '../FireBase/authService/registerWithEmailAndPassword'; // عدل المسار حسب تنظيم ملفاتك
import loginWithEmailAndPassword from '../FireBase/authService/loginWithEmailAndPassword';       // عدل المسار حسب تنظيم ملفاتك

const TestAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const res = await registerWithEmailAndPassword(email, password);
    console.log('🟢 نتيجة التسجيل:', res);
    alert(res.success ? '✅ تم التسجيل بنجاح' : `❌ خطأ: ${res.error}`);
  };

  const handleLogin = async () => {
    const res = await loginWithEmailAndPassword(email, password);
    console.log('🔵 نتيجة تسجيل الدخول:', res);
    alert(res.success ? '✅ تم تسجيل الدخول' : `❌ خطأ: ${res.error}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 تجربة تسجيل الدخول / التسجيل</h2>
      <input
        type="email"
        placeholder="الإيميل"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10, padding: 5 }}
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: 10, padding: 5 }}
      />

      <button onClick={handleRegister} style={{ marginRight: 10 }}>تسجيل حساب جديد</button>
      <button onClick={handleLogin}>تسجيل الدخول</button>
    </div>
  );
};

export default TestAuth;

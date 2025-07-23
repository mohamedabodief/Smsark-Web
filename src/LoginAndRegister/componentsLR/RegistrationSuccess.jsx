import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../FireBase/firebaseConfig";
import { requestPermissionAndSaveToken } from "../../FireBase/MessageAndNotification/fcmHelper";

export default function RegistrationSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                requestPermissionAndSaveToken(user.uid)
                    .then(() => {
                        console.log("✅ تم حفظ التوكين");
                    })
                    .catch((err) => {
                        console.error("❌ فشل حفظ التوكين:", err);
                    });

                setTimeout(() => {
                    navigate("/home", { replace: true });
                }, 2000);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
            }}
        >
            <Card
                sx={{
                    p: 5,
                    borderRadius: 6,
                    boxShadow: '0 8px 32px 0 rgba(31, 28, 44, 0.2)',
                    minWidth: 350,
                    maxWidth: 400,
                    textAlign: 'center',
                    backgroundColor: '#6E00FE',
                    color: '#FFFFFF',
                }}
            >
                <CheckCircleIcon sx={{ fontSize: 64, color: '#FFFFFF', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFFFFF', mb: 1, letterSpacing: 1 }}>
                    تم التسجيل بنجاح
                </Typography>
                <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 4, fontSize: 18 }}>
                    سيتم تحويلك تلقائيًا إلى الصفحة الرئيسية.
                </Typography>
            </Card>
        </Box>
    );
}

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import instapayLogo from "../assets/instapay.png";
import bankLogo from "../assets/bankLogo.png";

const PaymentIcons = {
  Bank: <img src={bankLogo} alt="bank" style={{ width: 120, height: 120 }} />,
  vodafone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="50"
      height="50"
      viewBox="0 0 48 48"
    >
      <path
        fill="#d50000"
        d="M16.65,5.397c5.015-1.999,10.857-1.861,15.738,0.461l0.066,0.085l0.098-0.034	c3.704,1.776,6.852,4.706,8.857,8.303c1.718,3.062,2.614,6.591,2.526,10.105c-0.017,4.545-1.716,9.045-4.628,12.52	c-2.754,3.314-6.605,5.698-10.803,6.653c-4.209,0.971-8.738,0.552-12.677-1.237c-3.855-1.722-7.12-4.714-9.197-8.395	c-1.728-3.059-2.642-6.586-2.566-10.105c0.008-4.384,1.565-8.735,4.283-12.164C10.518,8.852,13.399,6.675,16.65,5.397z"
      ></path>
      <path
        fill="#fff"
        d="M28.205,6.039c1.377-0.233,2.792-0.392,4.183-0.181l0.2,0.034l-0.134,0.051	c-1.294,0.371-2.545,0.951-3.554,1.86c-1.816,1.58-2.961,3.981-2.828,6.411c2.464,0.618,4.926,1.703,6.61,3.674	c1.764,2.013,2.402,4.806,2.206,7.431c-0.311,4.005-3.029,7.754-6.812,9.142c-2.521,0.94-5.409,0.952-7.898-0.102	c-2.583-1.064-4.727-3.127-5.944-5.642c-1.182-2.397-1.505-5.159-1.156-7.792c0.527-3.716,2.393-7.19,5.057-9.808	C20.912,8.505,24.466,6.745,28.205,6.039z"
      ></path>
    </svg>
  ),
  instapay: (
    <img
      src={instapayLogo}
      alt="Instapay"
      style={{ width: 150, height: 150 }}
    />
  ),
};

const accountDetails = {
  VISA: {
    bankAccount: "1234 5678 9012 3456",
    phone: "غير متاح",
    paymentAddress: "غير متاح",
  },
  "فودافون كاش": {
    phone: "0109 876 5432",
    bankAccount: "غير متاح",
    paymentAddress: "غير متاح",
  },
  "انستا باي": {
    bankAccount: "9876 5432 1098 7654",
    phone: "0112 345 6789",
    paymentAddress: "smsark-alakary@instapay",
  },
};

const PaymentMethods = () => {
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleOpen = (methodName) => {
    setSelectedMethod(methodName);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMethod(null);
  };

  const methods = [
    { name: "حساب بنكي", icon: PaymentIcons.Bank },
    { name: "فودافون كاش", icon: PaymentIcons.vodafone },
    { name: "انستا باي", icon: PaymentIcons.instapay },
  ];

  const renderDialogContent = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod) {
      case "VISA":
        return (
          <>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>رقم الحساب البنكي:</strong>{" "}
              {accountDetails["VISA"].bankAccount}
            </Typography>
          </>
        );

      case "فودافون كاش":
        return (
          <>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>رقم التليفون:</strong>{" "}
              {accountDetails["فودافون كاش"].phone}
            </Typography>
          </>
        );

      case "انستا باي":
        return (
          <>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>رقم الحساب البنكي:</strong>{" "}
              {accountDetails["انستا باي"].bankAccount}
            </Typography>
            <Typography variant="body1">
              <strong>رقم التليفون:</strong> {accountDetails["انستا باي"].phone}
            </Typography>
            <Typography variant="body1">
              <strong>عنوان الدفع:</strong>{" "}
              {accountDetails["انستا باي"].paymentAddress}
            </Typography>
          </>
        );

      default:
        return <Typography>لا توجد تفاصيل متاحة.</Typography>;
    }
  };

  return (
    <>
      <Grid
        container
        sx={{
          width: "100%",
          py: 4,
          px: 2,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          mt: 4,
          mb: 2,
          marginRight: 30,
        }}
        dir="rtl"
      >
        <Grid item xs={12}>
          <Typography
            variant="h5"
            sx={{
              color: "#6E00FE",
              display: "flex",
              justifyContent: "center",
              mb: 5,
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            وسائل تحويل قيمة الإعلان
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {methods.map((method, index) => (
              <Box
                key={index}
                onClick={() => handleOpen(method.name)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  p: 2,
                  borderRadius: 2,
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "rgba(253, 252, 255, 0.05)",
                  },
                  transition: "all 0.3s ease",
                  minWidth: 120,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {method.icon}
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mt: 1, fontWeight: "bold", color: "primary" }}
                >
                  {method.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

     

      <Grid item xs={12}>
        {/* النص المضاف */}
        <Typography
          variant="body1"
          sx={{
            color: "#444",
            textAlign: "center",
            mb: 1,
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.8,
          }}
        >
        <strong>تنويه هام:</strong> يرجى من العميل اختيار وسيلة الدفع
          الأنسب له، وسداد قيمة الباقة المختارة، ثم تجهيز صورة إيصال الدفع ليتم
          رفعها عند استكمال عملية الاشتراك في الباقة
        </Typography>
      </Grid>

       {/* Dialog */}
      <Dialog open={open} onClose={handleClose} dir="rtl">
        <DialogTitle>
          تفاصيل الدفع - {selectedMethod}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: -2, top: -5 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{renderDialogContent()}</DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentMethods;

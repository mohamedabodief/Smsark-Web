import React from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  MenuItem,
  styled,
  Box,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PhoneIcon from "@mui/icons-material/Phone";
import BathtubIcon from "@mui/icons-material/Bathtub";
import KingBedIcon from "@mui/icons-material/KingBed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, resetForm } from "./propertySlice";
import { governorates, propertyFeatures } from "./constants";

const StyledButton = styled(Button)({
  backgroundColor: "#6E00FE",
  color: "white",
  "&:hover": {
    backgroundColor: "#200D3A",
  },
  "&:disabled": {
    backgroundColor: "#cccccc",
  },
});

const StyledRadio = styled(Radio)({
  color: "#6E00FE",
  "&.Mui-checked": {
    color: "#6E00FE",
  },
  "&:hover": {
    color: "#200D3A",
  },
});

const PropertyForm = ({ onSubmit, loading }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.property.formData);
  const [errors, setErrors] = React.useState({});

  // /* ملاحظات بخصوص الصور:
  //  * - الكود دا متوقف حاليًا لأن فيه مشكلة في Firebase بتتظبط.
  //  * - لتشغيل خاصية الصور، هتحتاج تضيف Firebase Storage وتربط الكود مع `storage` من `firebaseConfig.js`.
  //  * - هتحتاج تضيف التحقق من حجم الصورة ونوعها (مثلاً: jpg, png) قبل الرفع.
  //  * - لما تكون جاهز تشغل الصور، شيل التعليقات دي واستخدم الكود اللي جواها.
  //  */
  // const [previewUrls, setPreviewUrls] = React.useState([]);
  //
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length + formData.images.length > 4) {
  //     setErrors({ ...errors, images: "يمكنك تحميل 4 صور كحد أقصى" });
  //     return;
  //   }
  //
  //   const newImages = [...formData.images, ...files];
  //   dispatch(setFormData({ ...formData, images: newImages }));
  //   setErrors({ ...errors, images: "" });
  //
  //   const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
  //   setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  // };
  //
  // const removeImage = (index) => {
  //   const newImages = [...formData.images];
  //   newImages.splice(index, 1);
  //   dispatch(setFormData({ ...formData, images: newImages }));
  //
  //   const newPreviews = [...previewUrls];
  //   URL.revokeObjectURL(newPreviews[index]);
  //   newPreviews.splice(index, 1);
  //   setPreviewUrls(newPreviews);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      })
    );
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (
      !formData.developer_name.trim() ||
      !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.developer_name)
    ) {
      newErrors.developer_name = "يجب إدخال اسم المطور (حروف فقط)";
    }
    if (!formData.phone || !/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone =
        "يجب إدخال رقم هاتف صحيح (11 رقم يبدأ بـ 010/011/012/015)";
    }
    if (!formData.location.governorate) {
      newErrors.governorate = "يجب اختيار المحافظة";
    }
    if (!formData.location.city.trim()) {
      newErrors.city = "يجب إدخال المدينة";
    }
    if (!formData.description.trim()) {
      newErrors.description = "يجب إدخال الوصف";
    }
    if (
      !formData.price_start_from ||
      !/^[0-9]+$/.test(formData.price_start_from)
    ) {
      newErrors.price_start_from = "يجب إدخال السعر الأدنى (أرقام فقط)";
    }
    if (!formData.price_end_to || !/^[0-9]+$/.test(formData.price_end_to)) {
      newErrors.price_end_to = "يجب إدخال السعر الأعلى (أرقام فقط)";
    }
    if (formData.rooms && !/^[0-9]+$/.test(formData.rooms)) {
      newErrors.rooms = "عدد الغرف يجب أن يكون رقمًا صحيحًا";
    }
    if (formData.bathrooms && !/^[0-9]+$/.test(formData.bathrooms)) {
      newErrors.bathrooms = "عدد الحمامات يجب أن يكون رقمًا صحيحًا";
    }
    if (formData.area && !/^[0-9]+$/.test(formData.area)) {
      newErrors.area = "المساحة يجب أن تكون رقمًا صحيحًا";
    }
    if (formData.floor && !/^[0-9]+$/.test(formData.floor)) {
      newErrors.floor = "رقم الطابق يجب أن يكون رقمًا صحيحًا";
    }
    // /* ملاحظة: التحقق من الصور متوقف لحين تجهيز Firebase Storage */
    // if (formData.images.length === 0) {
    //   newErrors.images = "يجب إضافة صورة واحدة على الأقل";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        price_start_from: Number(formData.price_start_from),
        price_end_to: Number(formData.price_end_to),
        rooms: Number(formData.rooms) || null,
        bathrooms: Number(formData.bathrooms) || null,
        area: Number(formData.area) || null,
        floor: Number(formData.floor) || null,
        furnished: formData.furnished === "نعم",
        negotiable: formData.negotiable === "نعم",
      });
      dispatch(resetForm());
      // setPreviewUrls([]); // تعليق لأنه خاص بالصور
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, mt: 5, maxWidth: 1000, mx: "auto" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#6E00FE", mb: 3, textAlign: "center" }}
      >
        <Box component="span" sx={{ borderBottom: "3px solid #6E00FE", px: 2 }}>
          إضافة عقار جديد
        </Box>
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} dir="rtl">
          {/* معلومات المطور */}
          <Grid size={{ xs: 6, md: 8, lg: 12 }}>
            <Typography
              variant="h5"
              sx={{
                color: "#6E00FE",
                mb: 2,
                mt: 2,
                position: "relative",
                textAlign: "right",
              }}
            >
              معلومات المطور
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="اسم المطور"
              name="developer_name"
              value={formData.developer_name}
              onChange={handleChange}
              error={!!errors.developer_name}
              helperText={errors.developer_name}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="رقم الهاتف"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <FormControl fullWidth error={!!errors.governorate}>
              <InputLabel>المحافظة</InputLabel>
              <Select
                name="governorate"
                value={formData.location.governorate}
                onChange={handleLocationChange}
                disabled={loading}
              >
                {governorates.map((gov) => (
                  <MenuItem key={gov} value={gov}>
                    {gov}
                  </MenuItem>
                ))}
              </Select>
              {errors.governorate && (
                <Typography variant="caption" color="error">
                  {errors.governorate}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="المدينة"
              name="city"
              value={formData.location.city}
              onChange={handleLocationChange}
              error={!!errors.city}
              helperText={errors.city}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Divider sx={{ mb: 2, mt: 2 }} />

          {/* معلومات العقار */}
          <Grid size={{ xs: 6, md: 6, lg: 12 }}>
            <Typography
              variant="h5"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              معلومات العقار
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="عدد الغرف"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              type="number"
              error={!!errors.rooms}
              helperText={errors.rooms}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KingBedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="عدد الحمامات"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              type="number"
              error={!!errors.bathrooms}
              helperText={errors.bathrooms}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BathtubIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="رقم الطابق"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              type="number"
              error={!!errors.floor}
              helperText={errors.floor}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="المساحة (م²)"
              name="area"
              value={formData.area}
              onChange={handleChange}
              type="number"
              error={!!errors.area}
              helperText={errors.area}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SquareFootIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="شروط التسليم"
              name="deliveryTerms"
              value={formData.deliveryTerms}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 6, lg: 12 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                مفروش
              </FormLabel>
              <RadioGroup
                row
                name="furnished"
                value={formData.furnished}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="نعم"
                  control={<StyledRadio />}
                  label="نعم"
                />
                <FormControlLabel
                  value="لا"
                  control={<StyledRadio />}
                  label="لا"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                حالة العقار
              </FormLabel>
              <RadioGroup
                row
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="جاهز"
                  control={<StyledRadio />}
                  label="جاهز"
                />
                <FormControlLabel
                  value="قيد الإنشاء"
                  control={<StyledRadio />}
                  label="قيد الإنشاء"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, textAlign: "right" }}
            >
              ميزات العقار (اختياري)
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {propertyFeatures.map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  onClick={() => {
                    dispatch(
                      setFormData({
                        ...formData,
                        features: formData.features.includes(feature)
                          ? formData.features.filter((f) => f !== feature)
                          : [...formData.features, feature],
                      })
                    );
                  }}
                  color={
                    formData.features.includes(feature) ? "primary" : "default"
                  }
                  variant={
                    formData.features.includes(feature) ? "filled" : "outlined"
                  }
                  disabled={loading}
                />
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, textAlign: "right" }}
            >
              وصف العقار{" "}
            </Typography>
            <TextField
              fullWidth
              label="وصف العقار"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={4}
              disabled={loading}
            />
          </Grid>

          {/* <Divider sx={{ mb: 2, mt: 2 }} /> */}

          {/* السعر */}
          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <Typography
              variant="h6"
              sx={{ color: "#6E00FE", mb: 2, mt: 2, textAlign: "right" }}
            >
              السعر
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="السعر يبدأ من (جنيه)"
              name="price_start_from"
              value={formData.price_start_from}
              onChange={handleChange}
              error={!!errors.price_start_from}
              helperText={errors.price_start_from}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <TextField
              fullWidth
              label="السعر ينتهي عند (جنيه)"
              name="price_end_to"
              value={formData.price_end_to}
              onChange={handleChange}
              error={!!errors.price_end_to}
              helperText={errors.price_end_to}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12, mb: 2 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                طريقة الدفع
              </FormLabel>
              <RadioGroup
                row
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="كاش"
                  control={<StyledRadio />}
                  label="كاش"
                />
                <FormControlLabel
                  value="تقسيط"
                  control={<StyledRadio />}
                  label="تقسيط"
                />
                <FormControlLabel
                  value="كاش أو تقسيط"
                  control={<StyledRadio />}
                  label="كاش أو تقسيط"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ color: "#6E00FE", textAlign: "right" }}
              >
                قابل للتفاوض
              </FormLabel>
              <RadioGroup
                row
                name="negotiable"
                value={formData.negotiable}
                onChange={handleChange}
                sx={{ justifyContent: "flex-end" }}
              >
                <FormControlLabel
                  value="نعم"
                  control={<StyledRadio />}
                  label="نعم"
                />
                <FormControlLabel
                  value="لا"
                  control={<StyledRadio />}
                  label="لا"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <StyledButton
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, py: 2, fontSize: "1.3rem" }}
            >
              {loading ? "جاري حفظ العقار..." : "إضافة العقار"}
            </StyledButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PropertyForm;

import { insertDevData } from "../Homeparts/RealEstateDevAdvExample";

export default function AdminPage() {
  return (
    <button onClick={insertDevData}>
      إدخال بيانات المطورين للعروض
    </button>
  );
}

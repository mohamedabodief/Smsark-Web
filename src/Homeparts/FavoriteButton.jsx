import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAsync } from '../redux/favoritesSlice';

const FavoriteButton = ({ advertisementId, type }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.list);
  const user = { id: "test-user" };

//   const isFavorited = favorites.some(
//   (fav) =>
//     fav.advertisement_id === advertisementId &&
//     fav.type?.toLowerCase() === type?.toLowerCase()
// );

  const isFavorited = favorites.some(
  (fav) => String(fav.advertisement_id) === String(advertisementId)
);

  console.log("Favorites in store:", favorites);
  console.log("isFavorited:", isFavorited);
  
  const handleToggle = () => {
    if (user?.id) {
      dispatch(toggleFavoriteAsync({ userId: user.id, advertisementId }));
    } else {
      alert('يرجى تسجيل الدخول أولاً');
    }
  };

  return (
    <Tooltip title="قائمة المفضل">
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation(); 
          handleToggle();
        }}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: '#fff',
          '&:hover': { backgroundColor: '#f0f0f0' }
        }}
      >
        {isFavorited ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon sx={{ color: 'gray' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;

// stop______________________
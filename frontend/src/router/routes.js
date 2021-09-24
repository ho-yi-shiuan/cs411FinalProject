import MainPage from '../components/mainpage/MainPage.vue'
import upload from '../components/upload/upload.vue'
import UserProfilePage from '../components/userProfile/ProfilePage.vue'

const router = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/upload',
    name: 'upload',
    component: upload
  },
  {
    path: '/profile',
    name: 'UserProfilePage',
    component: UserProfilePage
  },
]

export default router;

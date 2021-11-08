import MainPage from '../components/mainpage/MainPage.vue'
import upload from '../components/upload/upload.vue'
import UserProfilePage from '../components/userProfile/ProfilePage.vue'
import signin from '../components/userProfile/signin.vue'
import signup from '../components/userProfile/signup.vue'
import data from '../components/data/data.vue'

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
  {
    path: '/signup',
    name: 'signup',
    component: signup
  },
  {
    path: '/signin',
    name: 'signin',
    component: signin
  },
  {
    path: '/data',
    name: 'data',
    component: data
  },
]

export default router;

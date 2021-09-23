import MainPage from '../components/mainpage/MainPage.vue'
import upload from '../components/upload/upload.vue'

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
  }
]

export default router;

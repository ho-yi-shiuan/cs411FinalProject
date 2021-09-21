import MainPage from '../components/HelloWorld.vue'
import upload from '../components/upload/upload.vue'

const router = [
  {
    path: '',
    name: 'MainPage',
    component: MainPage,
    children: [
      {
        path: '/upload',
        name: 'upload',
        component: upload
      }
    ]
  }
]

export default router;

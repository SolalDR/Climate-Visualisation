import StartComponent from 'components/Start'
import GlobeComponent from 'components/Globe'
import DetailComponent from 'components/Detail'

export default [
  {
    path: '/',
    component: StartComponent
  },
  {
    path: '/globe',
    component: GlobeComponent
  },
  {
    path: '/country/:cd',
    component: DetailComponent,
    name: 'detail'
  }
]

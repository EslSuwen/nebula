import {NODE_ENV} from '../environment'

const apisMap = {
  development: {
    FE: 'http://localhost:3000',
    BASE: 'http://localhost:8099/forest',
    CDN: '',
    PROXY: '/proxy',
    SOCKET: 'http://localhost:3000',
    GRAVATAR: '/proxy/static.rymcu.com/avatar',
    domianURL: 'http://localhost:8099/forest'
  },
  production: {
    FE: 'http://10.26.201.17:32240/',
    BASE: 'http://10.26.201.17:32241/forest',
    CDN: 'https://static.rymcu.com',
    PROXY: 'http://10.26.201.17:32240/proxy',
    SOCKET: 'http://localhost:3000',
    GRAVATAR: 'https://static.rymcu.com/avatar'
  }
}

export default apisMap[NODE_ENV]

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
    FE: 'http://localhost:8099',
    BASE: 'http://localhost:8099',
    CDN: '',
    PROXY: '/proxy',
    SOCKET: 'http://localhost:3000',
    GRAVATAR: '/proxy/static.rymcu.com/avatar',
    domianURL: 'http://localhost:8099/forest'
  }
}

export default apisMap[NODE_ENV]

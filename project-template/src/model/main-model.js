import { actions } from 'mirrorx'
export default {
  name: 'mainModel',
  initialState: {
    userInfo: {}
  },
  reducers: {
    setUserInfo (state, data) {
      return Object.assign({}, state, { userInfo: data })
    }
  },
  effects: {
    requestUserInfo (type) {
      console.log('requestUserInfo...')
      setTimeout(() => {
        actions.mainModel.setUserInfo({ name: 'Nick' })
      }, 2000)

      // T.ajax({
      //   url: '/getUserInfo'
      // }).then((result) => {
      //   if (result.success) {
      //     let data = result.value || {}
      //     actions.mainModel.setUserInfo(data)
      //   }
      // })
    }
  }
}

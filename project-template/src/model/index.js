import mirror, { actions } from 'mirrorx'
import mainModel from './main-model'

/* 全站需要的model数据 */
if (!actions.mainModel) {
  mirror.model(mainModel)
}

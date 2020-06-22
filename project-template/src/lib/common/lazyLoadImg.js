/*
*使用：两步
*1、在img标签或者有背景图片的非img标签上添加data-src属性，把图片地址赋值给这个属性
*2、在资源加载完毕后执行LazyLoadImg.load()   （非异步获取的图片，在componentDidMount方法里执行，通过异步获取的，在请求完成后执行）
*/

var LazyLoadImg = global.LazyLoadImg = {
  init: function (opts) {
    LazyLoadImg.load(opts)

    window.onscroll = function () {
      LazyLoadImg.load(opts)
    }
  },
  getScrollTop: function () {
    return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0
  },
  getClientHeight: function () {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  },
  load: function (opts) {
    opts = opts || {}
    var subHeight = opts.subHeight || 50

    var scrollTop = LazyLoadImg.getScrollTop()
    var clientHeight = LazyLoadImg.getClientHeight()

    var imgs = document.querySelectorAll('[data-src]')
    var item
    var i
    var len = imgs.length
    var itemTop
    for (i = 0; i < len; i++) {
      item = imgs[i]
      itemTop = LazyLoadImg.getOffset(item).top
      if (itemTop !== undefined) {
        if (itemTop - scrollTop <= clientHeight + subHeight) {
          LazyLoadImg.loadSrcAction(item)
        }
      } else {
        LazyLoadImg.loadSrcAction(item)
      }
    }
  },
  loadSrcAction: function (item) {
    var src = item.getAttribute('data-src')
    if (src) {
      if (item && item.tagName === 'IMG') {
        item.setAttribute('src', src)
      } else {
        item.style['background-image'] = 'url(' + src + ')'
      }
    }

    item.setAttribute('data-src', '')
  },
  getOffset: function (elem, offset) {
    if (document.body.getBoundingClientRect) {
      let docElem = document.documentElement
      let box = elem.getBoundingClientRect()
      return {
        top: box.top + docElem.scrollTop,
        left: box.left + docElem.scrollLeft
      }
    } else {
      if (!offset) {
        offset = {}
        offset.top = 0
        offset.left = 0
      }
      if (elem === document.body) { // 当该节点为body节点时，结束递归
        return offset
      }

      offset.top += elem.offsetTop
      offset.left += elem.offsetLeft

      return LazyLoadImg.getOffset(elem.offsetParent, offset)// 向上累加offset里的值
    }
  }
}

LazyLoadImg.init({
  subHeight: 80 // 快到可视窗口的距离（这个时候加载图片）
})

export default LazyLoadImg

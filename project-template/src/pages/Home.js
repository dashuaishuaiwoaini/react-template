import React, { useState, useEffect, useRef } from 'react'
import { Input, Button } from 'antd'
import { actions } from 'mirrorx'

function useColorHook (myColor) {
  const [color, setColor] = useState('blue')

  useEffect(() => {
    setTimeout(() => {
      setColor(myColor)
    }, 1000)
  }, [])

  return [color, setColor]
}

function getNum () { // 复杂运算
  let i = 1
  let sum = 0
  while (i < 50) {
    sum += i * i
    i++
  }
  console.log('计算', sum)
  return sum
}

function getContent () {
  let currentLang = T.getCurrentLang()
  let enContent = {
    temp_home_key: 'Home Page'
  }
  let hkContent = {
    temp_home_key: '主页'
  }
  let contentMap = {
    en_US: enContent,
    zh_HK: hkContent
  }
  let content = contentMap[currentLang] || {}
  return content
}

function App () {
  const [color, setColor] = useColorHook('red')
  const [num] = useState(getNum) // 复杂计算的初始值可以传递一个函数
  const inputEl = useRef(null)

  useEffect(() => {
    console.log('useEffect begin...')

    return () => { // 如果组件多次渲染（通常如此），则在执行下一个 effect 之前，上一个 effect 就已被清除
      console.log('unmount')
    }
  })

  useEffect(() => {
    console.log('Color Chage:', color)
  }, [color])

  console.log('init.....')

  const showInputText = () => {
    let input = inputEl.current
    console.log(input.value)
  }

  let content = getContent()

  return <div className='tac f16 border ml30 mr30 pb30 mt30'>
    <div>
      <div className='font-bold'>粗体 font-bold</div>
      <div className='font-medium'>中等 font-medium</div>
      <div className='font-regular'>正常 font-regular</div>
      <div className='font-light'>细体 font-light</div>
    </div>
    <div className='mt20' style={{ color: color }}>
      {content['temp_home_key']} {num}
      <div className='mt50'><Input /></div>
      <div className='mt20'>
        <Button onClick={() => setColor('#999')}>Change Color</Button>
      </div>
      <div className='mt20'>
        <Button onClick={() => actions.routing.push({ pathname: '/test' })}>go</Button>
      </div>
      <div>
        <img src={global.__cdnpath + '/assets/images/face.png'} />
      </div>
      <div className='mt40'>
        <input ref={inputEl} placeholder='Please Input' />

        <div className='mt20'>
          <Button onClick={() => showInputText()}>showInputText</Button>
        </div>
      </div>
    </div>

  </div>
}

export default App

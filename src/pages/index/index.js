import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
import Gantt from '../../components/gantt'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    // request params day: start, end
    // startDate || endDate 两个日期必须有一个是存在与当前月份中的，否则不应该返回
    tasks: [
      {
        id: '123123',
        name: 'A0000010',
        steps: [
          {
            id: '12321',
            text: '任务开始',
            color: 'white',
            backgroundColor: '#1825a1',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-04',
            endDate: '2018-12-07',
          },
          {
            id: '12322',
            text: '第二步',
            color: 'black',
            backgroundColor: 'yellow',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-08',
            endDate: '2018-12-12',
          }
        ]
      },
      {
        id: '123124',
        name: 'V00010',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'white',
            backgroundColor: 'red',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-05',
            endDate: '2018-12-09',
          }
        ]
      },
      {
        id: '1231245',
        name: 'B00010',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'white',
            backgroundColor: 'grey',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-05',
            endDate: '2019-01-09',
          }
        ]
      },
      {
        id: '123126',
        name: 'C00010',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'white',
            backgroundColor: 'blue',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-09',
            endDate: '2018-12-12',
          }
        ]
      },
      {
        id: '123127',
        name: 'C00010',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'white',
            backgroundColor: 'blue',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-09',
            endDate: '2018-12-12',
          }
        ]
      },
      {
        id: '123128',
        name: 'C00010',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'white',
            backgroundColor: 'blue',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-09',
            endDate: '2018-12-12',
          }
        ]
      },
      {
        id: '123129',
        name: 'C00010',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'white',
            backgroundColor: 'blue',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-10-11',
            endDate: '2018-11-02',
          }
        ]
      },
      {
        id: '123120',
        name: 'C00011',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'black',
            backgroundColor: 'yellow',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-12-11',
            endDate: '2019-01-02',
          }
        ]
      },
      {
        id: '123121',
        name: 'XXXOOOASD',
        steps: [
          {
            id: '123211',
            text: '开发开始',
            color: 'black',
            backgroundColor: 'yellow',
            styleType: 'circle', // rect || circle || dotted
            startDate: '2019-04-11',
            endDate: '2019-04-12',
          }
        ]
      },
    ],
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Gantt prevMonthLength={1} nextMonthLength={1} tasks={this.state.tasks} />
      </View>
    )
  }
}


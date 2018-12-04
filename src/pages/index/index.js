import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'
import Gantt from '../../components/gantt'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
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
        <Gantt tasks={this.state.tasks} />
      </View>
    )
  }
}


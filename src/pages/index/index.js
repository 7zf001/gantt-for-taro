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
        name: 'A0000010',
        step: [
          {
            color: 1,
            styleType: 'circle', // rect || circle || dotted
            startDate: '2018-11-20',
            endDate: '2018-11-22',
          }
        ]
      }
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
        <Gantt monthLength={2} tasks={this.state.tasks} />
      </View>
    )
  }
}


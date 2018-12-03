import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import moment from 'dayjs'
import './index.less'

class Header extends Component {
  shouldComponentUpdate(prevProps) {
    if (prevProps.month === this.props.month && prevProps.year && this.props.year) {
      return false
    } else {
      return true
    }
  }
  render() {
    return (
      <View className='header'>
        <View className='header__date'><Text className='header__month'>{this.props.month}</Text>月/{this.props.year}年</View>
        <Text className='header__return-today' onClick={this.props.onReturnToday}>返回今天</Text>
      </View>
    )
  }
}

Header.defaultProps = {
  month: moment().format('MM'),
  year: moment().format('YYYY')
}

export default Header
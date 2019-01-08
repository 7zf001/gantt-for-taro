import PropTypes from 'prop-types'
import classNames from 'classnames'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

class Spin extends Component {
  constructor(props) {
    super(props)
    this.systemInfo = Taro.getSystemInfoSync()
  }
  render() {
    let { scrollLeft } = this.props
    scrollLeft = scrollLeft + this.systemInfo.windowWidth / 2
    return (
      <View className='gantt-spin' style={{left: `${scrollLeft}px`}}>
        <View className='lds-ellipsis'><View className='div'></View><View className='div'></View><View className='div'></View><View className='div'></View></View>
      </View>
    )
  }
}

Spin.defaultProps = {
  scrollLeft: 0
}

export default Spin
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import moment from 'dayjs'
import './index.less'

const TODAY = moment().format('YYYY-MM-DD')

class GanttDate extends Component {
  static defaultProps = {
    selected: TODAY,
    monthLength: 4
  }
  state = {
    daysInfo: []
  }
  componentWillMount() {
    let daysInfo = this.getDaysOfCenter(this.props.monthLength)
    this.setState({
      daysInfo
    })
  }
  /**
   * 获取当天月份前后{defaultMonthLength / 2}个月长度内的日期
   * @param length 总月份
   * @return Object 总月份长度内的日期
   */
  getDaysOfCenter = length => {
    if (typeof length === 'string') {
      length = parseInt(length)
    }
    if (typeof length !== 'number') {
      throw new Error('type length is ' + typeof length + ',type of length must be Number!')
    }
    // 以当前月为中心的年月数组
    let daysInfo = []
    let aroundCount = Math.round(length / 2)
    for (let i = -aroundCount; i <= aroundCount; i++) {
      let yearAndMonth = moment().add(i, 'month')
      let { years, months } = yearAndMonth.toObject()
      let daysInMonth = yearAndMonth.daysInMonth()
      for (let j of Array(daysInMonth).keys()) {
        let day = j + 1
        let fullDate = moment(`${years}-${months}-${day}`).format('YYYY-MM-DD')
        daysInfo.push({
          id: `date-${fullDate}`,
          fullDate,
          year: years,
          month: months,
          day: day
        })
      }
    }
    return daysInfo
  }
  /**
   * 获取当天月份前后{defaultMonthLength / 2}个月的月份信息
   * @param length 总月份
   * @return Object
   */
  getMonthsOfCenter = length => {
    if (typeof length !== 'number') {
        throw new Error('type of months must be Number!')
    }
    // 以当前月为中心的年月数组
    let monthsInfo = []
    let aroundCount = length / 2
    for (let i = -aroundCount; i <= aroundCount; i++) {
      let yearAndMonth = moment().add(i, 'month')
      let { years, months } = yearAndMonth.toObject()
      let daysInMonth = yearAndMonth.daysInMonth()
      monthsInfo.push({
        year: years,
        month: months + 1,
        endDay: daysInMonth
      })
    }
    return monthsInfo
  }
  render () {
    let { daysInfo } = this.state
    return (
      <View className='gantt-days'>
        {daysInfo.map(item => {
          return (
            <View 
              id={item.id}
              className={this.props.selected === item.fullDate ? 'selected gantt-day' : 'gantt-day'}
              key={item.id}
            >
              {item.day}
            </View>
          )
        })}
      </View>
    ) 
  }
}

export default GanttDate
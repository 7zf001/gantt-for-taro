import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import moment from 'dayjs'
// import GanttDate from './gantt-date'
import './index.less'

const TODAY = moment().format('YYYY-MM-DD')

class Gantt extends Component {
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
  componentDidMount() {
    let { daysInfo } = this.state
    let lastIndex = daysInfo.length - 1
    this.getDateRect(daysInfo[lastIndex])
  }
  getDateRect(item) {
    console.log(item)
    console.log(this.lastDay)
  }
  setProcessWidth() {

  }
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
  refLastDay = node => {
    this.lastDay = node
  }
  render () {
    let { daysInfo } = this.state
    let daysTemplate = daysInfo.map(item => {
      return (
        <View 
          id={item.id}
          className={this.props.selected === item.fullDate ? 'selected gantt-day' : 'gantt-day'}
          key={item.id}
          ref={this.refLastDay}
        >
          {item.day}
        </View>
      )
    })
    return (
      <View>
        <ScrollView
          className='container'
          scrollX
          scrollIntoView={`date-${TODAY}`}
        >
          <View className='gantt-days'>
            {daysTemplate}
          </View>
          <View className='process-container'>
            123
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Gantt
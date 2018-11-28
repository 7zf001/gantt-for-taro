import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import moment from 'dayjs'
import Header from './header'
import './index.less'

const TODAY = moment().format('YYYY-MM-DD')

class Gantt extends Component {
  static defaultProps = {
    selected: TODAY,
    // 显示当月前后多少个月
    monthLength: 2
  }
  constructor(props) {
    super(props)
    this.todayId = `date-${TODAY}`
    this.systemInfo = null
    this.env = Taro.getEnv()
    Taro.getSystemInfo()
      .then(res => {
        this.systemInfo = res
      })

    this.state = {
      daysInfo: [],
      scrollLeft: 0,
      processWidth: 0,
      selected: TODAY,
      selectedMonth: moment().format('MM'),
      selectedYear: moment().format('YYYY')
    }
  }
  componentWillMount() {
    let daysInfo = this.getDaysOfCenter(this.props.monthLength)
    this.setState({
      daysInfo
    })
  }
  componentDidMount() {
    if (this.env === Taro.ENV_TYPE.WEB) {
      setTimeout(() => {
        this.setViewPropertyWeb(`#${this.todayId}`)
      })
    } else if (this.env === Taro.ENV_TYPE.WEAPP) {
      this.setViewPropertyWeapp(`#${this.todayId}`)
    }
  }
   /**
   * web: 设置当天日期的位置和任务宽度
   * @param {String} id: #date-2018-11-20
   * @param {String} selectDay: 2018-11-20
   */
  setViewPropertyWeb(id) {
    let todayElement = document.getElementById(id)
    let { daysInfo } = this.state
    let lastId = daysInfo[daysInfo.length - 1]['id']
    let lastElement = document.getElementById(`${lastId}`)
    this.setState({
      scrollLeft: todayElement.offsetLeft - this.systemInfo.windowWidth / 2 + todayElement.offsetWidth / 2,
      processWidth: lastElement.offsetLeft + lastElement.offsetWidth
    })
  }
  /**
   * weapp: 设置当天日期的位置和任务宽度
   * @param {String} id: #date-2018-11-20
   * @param {String} selectDay: 2018-11-20
   */
  setViewPropertyWeapp(id, selectDay) {
    const query = Taro.createSelectorQuery().in(this.$scope)
    let { daysInfo } = this.state
    let lastId = daysInfo[daysInfo.length - 1]['id']
    query.select(id).boundingClientRect()
    query.select(`#${lastId}`).boundingClientRect()
    query.select('#container').scrollOffset()
    query.exec(res => {
      let todayRect = res[0]
      let lastRect = res[1]
      let scrollView = res[2]
      // 设置left，使屏幕水平中心显示当天
      let scrollLeft = todayRect.left + scrollView.scrollLeft - this.systemInfo.windowWidth / 2 + todayRect.width / 2
      let processWidth = lastRect.right + scrollView.scrollLeft
      let setSelectedObject = {}
      if (selectDay) {  
        setSelectedObject = {
          selected: selectDay,
          selectedMonth: moment(selectDay).format('MM'),
          selectedYear: moment(selectDay).format('YYYY')
        }
      }
      this.setState(prevState => ({
          scrollLeft: prevState.scrollLeft === scrollLeft ? scrollLeft + 0.1 : scrollLeft,
          processWidth,
          ...setSelectedObject
      }))
    })
  }
  getDaysOfCenter = length => {
    if (typeof length === 'string') {
      length = parseInt(length)
    }
    if (typeof length !== 'number' && length === length) {
      throw new Error('type length is ' + typeof length + ', type of length must be Number!')
    }
    // 以当前月为中心的年月数组
    let daysInfo = []
    let aroundCount = length
    for (let i = -aroundCount; i <= aroundCount; i++) {
      let yearAndMonth = moment().add(i, 'month')
      let { years, months } = yearAndMonth.toObject()
      months += 1
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
   * 点击日期
   * @param {Object} item : {id<String>: 'date-2018-11-20', fullDate<String>: '2018-11-20'}
   */
  selectDay(item) {
    if (this.env === Taro.ENV_TYPE.WEB) {
      setTimeout(() => {
        this.setViewPropertyWeb(`#${item.id}`)
      })
    } else if (this.env === Taro.ENV_TYPE.WEAPP) {
      this.setViewPropertyWeapp(`#${item.id}`, item.fullDate)
    }
  }
  /**
   * 返回当天
   */
  returnToday = () => {
    this.selectDay({
      id: `date-${TODAY}`, 
      fullDate: TODAY
    })
  }
  render () {
    console.log('render')
    let { daysInfo, scrollLeft, processWidth, selectedMonth, selectedYear } = this.state
    let daysTemplate = daysInfo.map(item => {
      let className = 'gantt-day'
      if (this.state.selected === item.fullDate) {
        className += ' selected'
      }
      return (
        <View 
          id={item.id}
          className={className}
          key={item.id}
          onClick={this.selectDay.bind(this, item)}
        >
          {item.day}
        </View>
      )
    })
    return (
      <View>
        <Header month={selectedMonth} year={selectedYear} onReturnToday={this.returnToday} />
        <ScrollView
          scrollX
          scrollWithAnimation
          id='container'
          className='container'
          scrollLeft={scrollLeft}
        >
          <View 
            className='gantt-days'
            style={{width: `${processWidth}px`}}
          >
            { daysTemplate }
          </View>
          {
            processWidth && (
              <View 
                className='process-container' 
                style={{width: `${processWidth}px`}}
              >
                123
              </View>
            )
          }
        </ScrollView>
      </View>
    )
  }
}

export default Gantt
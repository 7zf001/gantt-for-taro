import moment from 'dayjs'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import './index.less'
import Tasks from './tasks'
import Header from './header'

const TODAY = moment().format('YYYY-MM-DD')

class Gantt extends Component {
  constructor(props) {
    super(props)
    this.env = Taro.getEnv()
    this._observer = null
    this.lastTimestamp = 0
    this.lastScrollTimestamp = 0
    this.todayId = `date-${TODAY}`
    this.prevMonthLength = props.prevMonthLength
    this.nextMonthLength = props.nextMonthLength
    this.systemInfo = Taro.getSystemInfoSync()
    
    let daysInfo = this.getDaysOfCenter(props)
    
    this.state = {
      daysInfo,
      scrollX: true,
      scrollLeft: 0,
      selected: TODAY,
      // 所有日期的偏移量,减少重复获取元素次数
      dateViewOffsetMap: {},
      taskContarinerWidth: 0,
      // 处理task数据后才渲染
      isProcessedTaskData: false,
      selectedMonth: moment().format('MM'),
      selectedYear: moment().format('YYYY')
    }
  }
  componentDidMount() {
    if (this.env === Taro.ENV_TYPE.WEB) {
      setTimeout(() => {
        this.init()
      })
    } else if (this.env === Taro.ENV_TYPE.WEAPP) {
      this.init()
    }
  }
  init() {
    this.setViewPropertyWeapp(`${this.todayId}`)
    this.setDateOffsetWeapp(this.props.tasks)
    this.handleObserver()
  }
  componentWillUnmount() {
    this._observer && this._observer.disconnect()
  }
  /**
   * weapp: 设置日期的偏移量，用于tasks渲染任务视图
   */
  setDateOffsetWeapp(tasks) {
    // weapp
    // 所有日期
    let allStepDate = []
    let dateViewOffsetMap = {}
    tasks.forEach(item => {
      let steps = item.steps || []
      steps.forEach(step => {
        let { endDate, startDate } = step
        if (allStepDate.indexOf(endDate) === -1) {
          allStepDate.push(endDate)
        }
        if (allStepDate.indexOf(startDate) === -1) {
          allStepDate.push(startDate)
        }
      })
    })
    const query = Taro.createSelectorQuery().in(this.$scope)
    query.select(`#container`).scrollOffset()
    allStepDate.forEach(value => {
      query.select(`#date-${value}`).boundingClientRect()
    })
    query.exec(res => {
      let { scrollLeft } = res[0]
      res.shift()
      res.forEach( item => {
        if (item) {
          let { id: key, left, right } = item
          let offset = {
            left: scrollLeft + left,
            right: scrollLeft + right
          }
          dateViewOffsetMap[key] = offset
        }
      })
      this.setState({
        dateViewOffsetMap,
        isProcessedTaskData: true
      })
    })
  }
  /**
   * weapp: 设置当天日期的位置和任务宽度
   * @param {String} id: date-2018-11-20
   * @param {String} selectDay: 2018-11-20
   */
  setViewPropertyWeapp(id) {
    const query = Taro.createSelectorQuery().in(this.$scope)
    let { daysInfo } = this.state
    let lastId = daysInfo[daysInfo.length - 1]['id']
    query.select(`#${id}`).boundingClientRect()
    query.select(`#${lastId}`).boundingClientRect()
    query.select('#container').scrollOffset()
    query.exec(res => {
      let todayRect = res[0]
      let lastRect = res[1]
      let scrollView = res[2]
      // 设置left，使屏幕水平中心显示当天
      let scrollLeft = todayRect.left + scrollView.scrollLeft - this.systemInfo.windowWidth / 2 + todayRect.width / 2
      let taskContarinerWidth = lastRect.right + scrollView.scrollLeft
      let setSelectedObject = {}
      let selectDay = id.substring(5, id.length)

      if (selectDay) {  
        setSelectedObject = {
          selected: selectDay,
          selectedMonth: moment(selectDay).format('MM'),
          selectedYear: moment(selectDay).format('YYYY')
        }
      }

      this.setState(prevState => ({
          scrollX: false,
          scrollLeft: prevState.scrollLeft === scrollLeft ? scrollLeft + 0.1 : scrollLeft,
          taskContarinerWidth,
          ...setSelectedObject
      }), () => {
        this.setState({
          scrollX: true
        })
      })
    })
  }
  setTaskViewWidth() {
    const query = Taro.createSelectorQuery().in(this.$scope)
    let { daysInfo } = this.state
    let lastId = daysInfo[daysInfo.length - 1]['id']
    query.select(`#${lastId}`).boundingClientRect()
    query.select('#container').scrollOffset()
    query.exec(res => {
      let lastRect = res[0]
      let scrollView = res[1]
      let taskContarinerWidth = lastRect.right + scrollView.scrollLeft
      this.setState({
        scrollX: false,
        taskContarinerWidth
      }, () => {
        this.setState({
          scrollX: true
        })
      })
    })
  }
  /**
   * 左右滑动修改年月
   */
  handleObserver() {
    this._observer && this._observer.disconnect()
    this._observer = Taro.createIntersectionObserver(this.$scope, { observeAll: true })
    let width = -(this.systemInfo.windowWidth - 2) / 2
    let margins = {
      left: width,
      right: width
    }
    this._observer.relativeTo('#container', margins)
    this._observer.observe('.gantt__day', res => {
        this.setState({
          selectedYear: moment(res.dataset.id).year(),
          selectedMonth: moment(res.dataset.id).format('MM')
        })
    })
  }
  /**
   * 获取以当天为中心的日期数组，长度为该月延伸正负length个月
   */
  getDaysOfCenter = ({prevMonthLength, nextMonthLength}) => {
    // 以当前月为中心的年月数组
    let daysInfo = []
    for (let i = -prevMonthLength; i <= nextMonthLength; i++) {
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
        this.setViewPropertyWeapp(`${item.id}`)
      })
    } else if (this.env === Taro.ENV_TYPE.WEAPP) {
      this.setViewPropertyWeapp(`${item.id}`)
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
  /**
   * 滑动至最左或最右加载日期，重新渲染任务
   * @param {String} type 
   */
  loadMoreData(type) {
    // 间隔
    let inTime = 2000
    let currentTimestamp = new Date()
    if (currentTimestamp - this.lastTimestamp >= inTime) {
      switch(type) {
        case 'upper':
          this.prevMonthLength += 1
          break;
        case 'lower':
          this.nextMonthLength += 1
          break;
      }
      this.lastTimestamp = currentTimestamp
      let daysInfo = this.getDaysOfCenter({
        prevMonthLength: this.prevMonthLength,
        nextMonthLength: this.nextMonthLength
      })
      this.setState({
        isProcessedTaskData: true,
        daysInfo
      }, () => {
        Taro.showLoading({
          title: '加载中...'
        })
        // 重新渲染任务
        if (this.env === Taro.ENV_TYPE.WEB) {
          setTimeout(() => {
            this.setTaskViewWidth()
            this.setDateOffsetWeapp(this.props.tasks)
            this.handleObserver()
            Taro.hideLoading()
          })
        } else if (this.env === Taro.ENV_TYPE.WEAPP) {
          this.setTaskViewWidth()
          this.setDateOffsetWeapp(this.props.tasks)
          this.handleObserver()
          Taro.hideLoading()
        }
      })
    }
  }
  scrollToUpper() {
    this.loadMoreData('upper')
  }
  scrollToLower() {
    this.loadMoreData('lower')
  }
  render () {
    let { tasks } = this.props
    let { scrollX, daysInfo, scrollLeft, taskContarinerWidth, selectedMonth, selectedYear, isProcessedTaskData, dateViewOffsetMap } = this.state
    let daysTemplate = daysInfo.map(item => {
      let className = classNames(
        'gantt__day', 
        {
          'gantt__day_selected': this.state.selected === item.fullDate
        }
      )
      return (
        <View 
          className='gantt__day-wrap'
          key={item.id}
          onClick={this.selectDay.bind(this, item)}
        >
          <View data-id={item.fullDate} id={item.id} className={className}>{item.day}</View>
        </View>
      )
    })

    return (
      <View>
        <Header month={selectedMonth} year={selectedYear} onReturnToday={this.returnToday} />
        <ScrollView
          id='container'
          scrollX={scrollX}
          scrollWithAnimation
          upperThreshold='0'
          lowerThreshold='0'
          scrollLeft={scrollLeft}
          className='gantt__container'
          onScrollToLower={this.scrollToLower}
          onScrollToUpper={this.scrollToUpper}
        >
          <View 
            className='gantt__days-container'
          >
            { daysTemplate }
          </View>
          {
            taskContarinerWidth && (
              <View 
                className='gantt__tasks-container' 
                style={{width: `${taskContarinerWidth}px`}}
              >
                { isProcessedTaskData && (
                  <Tasks 
                    tasks={tasks}
                    dateViewOffsetMap={dateViewOffsetMap}
                    taskContarinerWidth={taskContarinerWidth}
                  />
                )}
              </View>
            )
          }
        </ScrollView>
      </View>
    )
  }
}

Gantt.defaultProps = {
  tasks: [],
  selected: TODAY,
  // 显示当月前后多少个月
  nextMonthLength: 1,
  prevMonthLength: 1
}

Gantt.propTypes = {
  selected: PropTypes.string.isRequired,
  prevMonthLength: PropTypes.number.isRequired,
  nextMonthLength: PropTypes.number.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      color: PropTypes.string,
      styleType: PropTypes.string,
      endDate: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      backgroundColor: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }))
  })).isRequired
}

export default Gantt
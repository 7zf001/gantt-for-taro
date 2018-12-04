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
    this.todayId = `date-${TODAY}`
    this.systemInfo = null
    // 所有日期的偏移量,减少重复获取元素次数
    this.dateViewOffsetMap = new Map()
    this.env = Taro.getEnv()
    this.systemInfo = Taro.getSystemInfoSync()
    let daysInfo = this.getDaysOfCenter(this.props.monthLength)
    this.state = {
      // 所有日期的偏移量,减少重复获取元素次数
      dateViewOffsetMap: {},
      // 处理task数据后才渲染
      isProcessedTaskData: false,
      daysInfo,
      scrollLeft: 0,
      selected: TODAY,
      taskContarinerWidth: 0,
      selectedMonth: moment().format('MM'),
      selectedYear: moment().format('YYYY')
    }
  }
  componentDidMount() {
    if (this.env === Taro.ENV_TYPE.WEB) {
      setTimeout(() => {
        this.setViewPropertyWeb(`${this.todayId}`)
      })
    } else if (this.env === Taro.ENV_TYPE.WEAPP) {
      this.setViewPropertyWeapp(`${this.todayId}`)
      this.setTasksDataWeapp(this.props.tasks)
    }
  }
  /**
   * 获取任务列表的数据，使其渲染任务视图
   */
  setTasksDataWeapp(tasks) {
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
    allStepDate.forEach(value => {
      query.select(`#date-${value}`).boundingClientRect()
    })
    query.exec(res => {
      res.forEach(item => {
        let { id: key, left, right } = item
        let offset = {
          left,
          right
        }
        dateViewOffsetMap[key] = offset
      })
      this.setState({
        dateViewOffsetMap,
        isProcessedTaskData: true
      })
    })
  }
  /**
   * web: 设置当天日期的位置和任务宽度
   * @param {String} id: #date-2018-11-20
   * @param {String} selectDay: 2018-11-20
   */
  setViewPropertyWeb(id, selectDay) {
    let { daysInfo } = this.state
    let lastId = daysInfo[daysInfo.length - 1]['id']
    let todayElement = document.getElementById(id)
    let lastElement = document.getElementById(`${lastId}`)
    let setSelectedObject = {}
    
    if (selectDay) {  
      setSelectedObject = {
        selected: selectDay,
        selectedMonth: moment(selectDay).format('MM'),
        selectedYear: moment(selectDay).format('YYYY')
      }
    }

    let scrollLeft = todayElement.offsetLeft - this.systemInfo.windowWidth / 2 + todayElement.offsetWidth / 2
    let taskContarinerWidth = lastElement.offsetLeft + lastElement.offsetWidth

    this.setState(prevState => ({
        scrollLeft: prevState.scrollLeft === scrollLeft ? scrollLeft + 0.1 : scrollLeft,
        taskContarinerWidth,
        ...setSelectedObject
    }))
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

      if (selectDay) {  
        setSelectedObject = {
          selected: selectDay,
          selectedMonth: moment(selectDay).format('MM'),
          selectedYear: moment(selectDay).format('YYYY')
        }
      }

      this.setState(prevState => ({
          scrollLeft: prevState.scrollLeft === scrollLeft ? scrollLeft + 0.1 : scrollLeft,
          taskContarinerWidth,
          ...setSelectedObject
      }))
    })
  }
  /**
   * 获取以当天为中心的日期数组，长度为该月延伸正负length个月
   * @param {Number} length
   */
  getDaysOfCenter = length => {
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
        this.setViewPropertyWeb(`${item.id}`, item.fullDate)
      })
    } else if (this.env === Taro.ENV_TYPE.WEAPP) {
      this.setViewPropertyWeapp(`${item.id}`, item.fullDate)
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
    let { tasks } = this.props
    let { daysInfo, scrollLeft, taskContarinerWidth, selectedMonth, selectedYear, isProcessedTaskData, dateViewOffsetMap } = this.state
    console.log(dateViewOffsetMap)
    let daysTemplate = daysInfo.map(item => {
      let className = classNames(
        'gantt__day', 
        {
          'gantt__day_selected': this.state.selected === item.fullDate
        }
      )
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
          className='gantt__container'
          scrollLeft={scrollLeft}
        >
          <View 
            className='gantt__days-container'
            style={{width: `${taskContarinerWidth}px`}}
          >
            { daysTemplate }
          </View>
          {
            taskContarinerWidth && (
              <View 
                className='gantt__tasks-container' 
                style={{width: `${taskContarinerWidth}px`}}
              >
                <Tasks isProcessedTaskData={isProcessedTaskData} dateViewOffsetMap={dateViewOffsetMap} tasks={tasks} />
              </View>
            )
          }
        </ScrollView>
      </View>
    )
  }
}

Gantt.defaultProps = {
  selected: TODAY,
  // 显示当月前后多少个月
  monthLength: 2
}

Gantt.propTypes = {
  selected: PropTypes.string.isRequired,
  monthLength: PropTypes.number,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      color: PropTypes.string,
      backgroundColor: PropTypes.string.isRequired,
      styleType: PropTypes.string,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      text: PropTypes.string
    }))
  })).isRequired
}

export default Gantt
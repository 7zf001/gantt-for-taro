import PropTypes from 'prop-types'
import classNames from 'classnames'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'
import utils from '../utils'

class Tasks extends Component {
  state = {
    selectedTaskId: null
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (utils.deepCompare(this.props, nextProps) && utils.deepCompare(this.state, nextState)) {
      return false
    } else {
      return true
    }
  }
  handleClickTask(item) {
    this.setState({
      selectedTaskId: item.id
    })
  }
  render() {
    console.log('tasks render')
    let { selectedTaskId } = this.state
    let { tasks, dateViewOffsetMap } = this.props
    let tasksTemplate = tasks.map( item => {
      let steps = item.steps || []
      let template = steps.map( step => {
        let { id, color, backgroundColor, startDate, endDate, text, styleType } = step
        let offset = {
          start: dateViewOffsetMap[`date-${startDate}`],
          end: dateViewOffsetMap[`date-${endDate}`]
        }
        let width = offset['end']['right'] - offset['start']['left'] + 'px'
        let style = {
          width,
          color,
          position: 'absolute',
          background: backgroundColor,
          left: `${offset['start']['left']}px`
        }
        let className = classNames(
          'gantt__task-item',
          {
            'gantt__task-item_circle': styleType === 'circle' // rect || circle || dotted
          }
        )
        return (
          <View className={className} key={id} style={style}>
            { text }
          </View>
        )
      })
      let className = classNames(
        'gantt__task-wrap',
        {
          'gantt__task-wrap_clicked': item.id === selectedTaskId
        }
      )
      return (
        <View
          onClick={this.handleClickTask.bind(this, item)}
          className={className}
          key={item.name}
        >
          { template }
        </View>
      )
    })

    return (
      <View>{ tasksTemplate }</View>
    )
  }
}

Tasks.defaultProps = {
  dateViewOffsetMap: {},
  tasks: []
}

Tasks.propTypes = {
  dateViewOffsetMap: PropTypes.object,
  tasks: PropTypes.array
}

export default Tasks
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
    console.log('shouldComponentUpdate')
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
  getStepOffset(taskItem) {
    let { startDate, endDate } = taskItem
    let { dateViewOffsetMap } = this.props
    let startOffset = dateViewOffsetMap[`date-${startDate}`]
    let endOffset = dateViewOffsetMap[`date-${endDate}`]
    let offset = {
      start: startOffset || null,
      end: endOffset || null
    }
    return offset
  }
  render() {
    console.log('tasks render')
    let { selectedTaskId } = this.state
    let { tasks, taskContarinerWidth } = this.props

    let tasksTemplate = tasks.map( task => {
      let { steps = [], id: itemId, name } = task

      let template = steps.map( step => {
        let { id, color, backgroundColor, text, styleType } = step
        let offset = this.getStepOffset(step)
        let width = 0
        let left = 0
        let style = {}
        let isRenderStep = true
        // 单个任务长度会因某个日期不存而变化
        if (offset.start && offset.end) {
          left = `${offset['start']['left']}px`
          width = `${offset['end']['right'] - offset['start']['left']}px`
        } else if (offset.start) {
          left = `${offset['start']['left']}px`
          width = `${taskContarinerWidth - offset['start']['left']}px`
          styleType = 'start-circle'
        } else if (offset.end) {
          left = `0px`
          width = `${offset['end']['right']}px`
          styleType = 'end-circle'
        } else {
          isRenderStep = false
        }

        style = {
          left,
          width,
          color,
          ...style,
          backgroundColor
        }

        let className = classNames(
          'gantt__task-item',
          // rect || circle, end_circle, start_circle) || dotted
          `gantt__task-item_${styleType}`
        )
        return isRenderStep ? (
          <View className={className} key={id} style={style}>
            { text }
          </View>
        ) : null
      })
      let className = classNames(
        'gantt__task-wrap',
        {
          'gantt__task-wrap_clicked': itemId === selectedTaskId
        }
      )
      
      // 获取任务第一个step获取其offset使name偏移到第一个step前
      let firstStepOffset = this.getStepOffset(steps[0])
      let taskNameStyle = null
      
      if (firstStepOffset['start']) {
        taskNameStyle = {
          left: `${firstStepOffset.start.left}px`
        }
      }

      return (
        <View
          key={name}
          className={className}
          onClick={this.handleClickTask.bind(this, task)}
        >
          { taskNameStyle && (
            <View 
              id={`name-${name}`}
              style={taskNameStyle}
              className='gantt__task-item gantt__task-name'
            >
              { name }
            </View>
          )}
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
  tasks: [],
  // 所有日期的偏移量
  dateViewOffsetMap: {},
  taskContarinerWidth: 0,
}

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  dateViewOffsetMap: PropTypes.object.isRequired,
  taskContarinerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default Tasks
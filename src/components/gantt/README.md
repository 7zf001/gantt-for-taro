# SOP 任务流程组件

最低版本: 2.0.0

# 组件参数

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
| ---  | ---- | ------ | ---- | ---- |
|tasks| Array | [Objects] | 是 | 任务列表 |
|selected|String| moment().format('YYYY-MM-DD') | 否 | 默认选择的时间 |
|prevMonthLength| Number | 1 | 否 | 当前月份向前加载多少个月份 |
|nextMonthLength| Number | 1 | 否 | 当前月份向后加载多少个月份 | 

## tasks[0]

|属性|说明|类型|必填|备注|
|--|--|--|--|--|
|id|唯一标识|String/Number|是||
|name|任务名|String|是||
|steps|任务步骤|Array|是|看下面详情|

## steps[0]

|属性|说明|类型|必填|备注|
|--|--|--|--|--|
|id|唯一标识|String/Number|是||
|startDate|开始时间|String|是||
|endDate|结束时间|String|是||
|backgroundColor|背景颜色|String|是||
|text|文字|String|否||
|color|文字|String|否||
|styleType|任务框样式|String|否|默认：circle|

# 效果

![效果1](./gantt_image_01.gif)
![效果2](./gantt_image_02.gif)
![效果3](./gantt_image_03.gif)

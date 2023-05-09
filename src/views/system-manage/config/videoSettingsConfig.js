const videoModule = [
  {
    m : 'video',
    k : 'video_try_watch_video_time',
    v : '',
    t : 1,
    label : '试看时长',
    des : '游客和普通用户观看VIP视频的试看时长，单位秒'
  }
]
const strorageModule = [
  {
    m : 'strorage',
    k : 'strorage_store_azure_connect_url_',
    v : '',
    t : 1,
    label : '连接字符串',
    des : ''
  },
  {
    m : 'strorage',
    k : 'strorage_store_azure_container_name_',
    v : '',
    t : 1,
    label : '容器名称',
    des : ''
  },
  {
    m : 'strorage',
    k : 'strorage_store_azure_sas_url_',
    v : '',
    t : 1,
    label : 'SAS URL',
    des : ''
  }
]

export { videoModule, strorageModule }

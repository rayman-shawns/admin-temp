<template>
  <div class="upload-img">
    <el-upload
      ref="upload"
      :action="realAction"
      :headers="headers"
      :data="data"
      :name="name"
      :show-file-list="false"
      :size="size"
      :accept="accept"
      :on-success="onSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      class="hz-uploader"
    >
      <div class="img-wrapper">
        <el-button type="primary">上传文件</el-button>
        <el-progress
          v-if="progressPercentage > 0"
          :text-inside="true"
          :stroke-width="20"
          :percentage="progressPercentage"
          status="warning"
        />
        <!-- <el-link @click.stop :href="defaultImg" target="_blank" class="urllink" v-if="defaultImg">{{
          defaultImg
        }}</el-link> -->
      </div>
    </el-upload>
    <!-- <div v-if="$slots.default" class="el-upload__tip">{{ tips }}</div>
    <div v-else class="el-upload__tip">只能上传{{ accept }}文件，且不超过{{ getFileSize(size) }}</div> -->
  </div>
</template>

<script>
import { useUserStore } from '/@/store'
import { ElMessage } from 'element-plus'
import { BlobServiceClient } from '@azure/storage-blob'

export default {
  setup() {
    const userStore = useUserStore()
    const { imgContainer } = userStore
    return {
      imgContainer
    }
  },
  props : {
    actions : {
      type : String,
      default : '/admin/images'
    },
    defaultImg : {
      type : String,
      default : ''
    },
    accept : {
      type : String,
      default : 'application/x-apple-aspen-config,application/vnd.android.package-archive'
    },
    size : {
      type : Number,
      default : 500 // 单位为kb
    },
    name : {
      type : String,
      default : 'image'
    },
    data : {
      type : Object,
      default : () => {}
    },
    tips : {
      type : String,
      default : '只能上传jpg/png/gif/bmp文件，且不超过500kb'
    }
  },
  data() {
    return {
      headers : {
        Authorization : 'Bearer '
      },
      dialogVisible : false,
      dialogImageUrl : '',
      files : null,
      fileList : [],
      progressPercentage : 0,
      timer : null
    }
  },
  computed : {
    realAction() {
      // const condition =
      //   this.actions.includes( 'http://' ) || this.actions.includes( 'https://' )
      return 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15'
      // return condition
      //   ? this.actions
      //   : process.env.VUE_APP_API_URL +
      //       process.env.VUE_APP_BASE_API +
      //       this.actions
    }
  },
  watch : {
    defaultImg( newVal ) {
      if ( newVal ) {
        this.fileList = [{ url : newVal }]
      }
    }
  },
  created() {
    if ( this.defaultImg ) {
      this.fileList = [{ url : this.defaultImg }]
    }
  },
  beforeUnmount() {
    clearInterval( this.timer )
    this.progressPercentage = 0
  },
  methods : {
    /** 获取file大小的名称 */
    getFileSize( size ) {
      var size_int = size
      if ( typeof size === 'string' && size.constructor === String ) {
        size_int = parseInt( size )
      }
      var formatSize
      if ( parseInt( size_int / 1024 ) > 0 ) {
        formatSize = ( size_int / 1024 ).toFixed( 2 ) + 'MB'
      } else if ( parseInt( size_int ) > 0 ) {
        formatSize = size_int.toFixed( 2 ) + 'kB'
      } else {
        formatSize = size_int + 'Byte'
      }
      return formatSize
    },
    beforeUpload( file ) {
      this.$emit( 'beforeUpload' )
      try {
        this.handleUpload( file )
      } catch ( error ) {
        this.$emit( 'uploadDone' )
      }
      // this.accept = this.accept.toLowerCase()
      // const fileType = file.type.toLowerCase()
      // const type = this.accept.includes( fileType )
      // const isLtSize = file.size / 1024 < this.size
      // console.log( file, isLtSize, 'isLtSize' )
      // if ( !type ) {
      //   ElMessage.error( '请上传正确的文件格式!' + this.accept )
      // }

      // if ( !isLtSize ) {
      //   ElMessage.error( `文件大小不能超过${this.getFileSize( this.size )}` )
      // }
      return false
      // return type && isLtSize
    },
    onSuccess( res, file ) {
      this.files = URL.createObjectURL( file.raw )
      this.$emit( 'onSuccess', res, file )
    },
    preview( file ) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleError( error ) {
      ElMessage.error( '上传出错了,请重试!' )
      throw error
    },
    reUpload() {
      // this.files = null
      // this.$emit('onSuccess', { id: '', path: '' })
      // this.$refs.upload.clearFiles()
    },
    handleUpload( e ) {
      // const file = e.target.files[0]
      const file = e
      const fileInput = {
        files : file
      }
      // this.$refs.importFile.value = ''
      console.log( 'handleUpload', file, fileInput )
      const blobSasUrl = import.meta.env.VITE_BLOB_SAS_URL
      // const blobSasUrl =
      //   'https://pinseoss.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwlacupx&se=2023-12-30T18:44:38Z&st=2022-12-16T10:44:38Z&spr=https&sig=PYGLGCjNJXQ9pcbC1oNKiFlEbbpwss9qSC1%2B%2B%2Fu13pw%3D'
      // Create a new BlobServiceClient
      const blobServiceClient = new BlobServiceClient( blobSasUrl )

      // Create a unique name for the container by
      // appending the current time to the file name
      const containerName = ''

      // Get a container client from the BlobServiceClient
      const containerClient = blobServiceClient.getContainerClient( containerName )
      /*
      const createContainer = async() => {
        try {
          console.log( `Creating container "${containerName}"...` )
          await containerClient.create()
          console.log( `Done. URL:${containerClient.url}` )
        } catch ( error ) {
          console.log( error.message )
        }
      }*/

      // const listFiles = async() => {
      //   try {
      //     let count = 0
      //     console.log( 'Retrieving file list...' )
      //     const iter = containerClient.listBlobsFlat()
      //     let blobItem = await iter.next()
      //     while ( !blobItem.done ) {
      //       count++
      //       console.log( 'blobItem---', blobItem )
      //       blobItem = await iter.next()
      //     }
      //     if ( count > 0 ) {
      //       console.log( 'Done.' )
      //     } else {
      //       console.log( 'The container does not contain any files.' )
      //     }
      //   } catch ( error ) {
      //     console.log( 'error', error.message )
      //   }
      // }

      const uploadFiles = async() => {
        try {
          console.log( 'Uploading files...' )
          const promises = []
          // for ( const file of fileInput.files ) {
          //   const blockBlobClient = containerClient.getBlockBlobClient( file.name )
          //   promises.push( blockBlobClient.uploadBrowserData( file ) )
          // }
          // 图片名规则  模块名/年/月/日/uuid.原后缀 videoRes/2022/12/16/123123123123.jpg
          const filename = file.name
          const extname = `${filename}`.substr( `${filename}`.lastIndexOf( '.' ) + 1 )
          Object.defineProperty( file, 'name', {
            writable : true
          } )
          // console.log( '2222', file, filename, extname )
          file.name = `videoRes/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${file.uid}.${extname}`
          const blockBlobClient = containerClient.getBlockBlobClient( file.name )
          promises.push( blockBlobClient.uploadBrowserData( file ) )

          clearInterval( this.timer )
          this.progressPercentage = 0
          this.timer = setInterval( () => {
            if ( this.progressPercentage <= 90 ) {
              this.progressPercentage += 10
            } else {
              this.progressPercentage = 99
            }
          }, 500 )
          const res = await Promise.all( promises )

          clearInterval( this.timer )
          this.progressPercentage = 100
          console.log( 'Done.', promises, res )
          this.$emit( 'onSuccess', file, res )
          // listFiles()
        } catch ( error ) {
          console.log( 'error', error.message )
          clearInterval( this.timer )
          this.$emit( 'uploadDone' )
        }
      }

      // const deleteContainer = async() => {
      //   try {
      //     console.log( `Deleting container "${containerName}"...` )
      //     await containerClient.delete()
      //     console.log( `Done.` )
      //   } catch ( error ) {
      //     console.log( error.message )
      //   }
      // }
      // createContainer()
      // listFiles()
      uploadFiles()
      // deleteContainer()
    }
  }
}
</script>

<style scoped lang="scss">
.upload-img {
  // ::v-deep .el-upload--picture-card{
  //   width: 30px;
  //   height: 30px;
  //   border: none;
  //   line-height: 30px;
  // }
  // ::v-deep .el-upload-list--picture-card {
  //   .el-upload-list__item {
  //     height: 30px;
  //     width: 30px;
  //   }
  // }
  .hz-uploader {
    // border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(.el-upload) {
      width: 100%;
      height: 100%;
      display: flex;
      overflow: hidden;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .urllink {
    margin-left: 14px;
    margin-right: 4px;
  }
  .el-progress {
    margin-left: 14px;
    margin-right: 4px;
    width: 120px;
  }

  :deep(.image) {
    margin-left: 10px;
    max-height: 200px;
    .el-image__inner {
      max-height: 200px;
    }
  }
  .img-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>

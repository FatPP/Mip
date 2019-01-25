<template>
    <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :header="{headers}"
  :on-change="handleChange"
  :on-success="handleSuccess"
  :file-list="fileList3">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
</template>


<script>
  export default {
    data() {
      return {
        fileList3: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
      };
    },
   
    methods: {
      handleChange(file, fileList) {
        this.fileList3 = fileList.slice(-3);
      },   
// 文件上传成功时的钩子
    handleSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      var fj = [];
      this.upload.fj = fj;
      this.upload.fj.push({name:response.name, url:response.url});
      console.log(this.upload);
    },

    }
  }
</script>
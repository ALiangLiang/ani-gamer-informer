<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="title" label="標題" width="180"> </el-table-column>
    <el-table-column prop="cover" label="海報" width="180">
      <template slot-scope="scope">
        <img class="cover-preview" :src="scope.row.cover">
      </template>
    </el-table-column>
    <el-table-column prop="info" label="最新集數" width="180"> </el-table-column>
  </el-table>
</template>
<script>
  export default {
    data: () => ({
      tableData: []
    }),
    async created () {
      const tableData = (await new Promise((resolve) => chrome.storage.sync.get('updatedAnimes', resolve))).updatedAnimes
      this.tableData = tableData

      // 當瀏覽器按鈕被按下時，重置。
      chrome.browserAction.disable()
      chrome.browserAction.setBadgeText({text: ''})
    }
  }
</script>
<style>
  .cover-preview {
    width: 100%;
  }
</style>

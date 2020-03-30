<template>
  <div id="app">
    <div>
      <el-input v-model="uid" placeholder="请输入内容"/>
      <el-input v-model="userSig" placeholder="请输入内容"/>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="primary" @click="logout">退出</el-button>
    </div>
    <div>
      <el-button type="primary" @click="getGroupList">获取群组列表</el-button>

    </div>
    <div>
      <el-input v-model="groupId" placeholder="请输入群组id"/>
      <el-button type="primary" @click="joinGroup">加群</el-button>
    </div>
    <div>
      <el-input v-model="groupId" placeholder="请输入群组id"/>
      <el-button type="primary" @click="quitGroup">退群</el-button>
    </div>
    <div>
      <el-input v-model="msg" placeholder="请输入消息内容"/>
      <el-button type="primary" @click="sendGroupMessage">发送</el-button>
    </div>
  </div>
</template>

<script>
  import TIM from 'tim-js-sdk'
  // import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
  import COS from 'cos-js-sdk-v5'
  // import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';

  // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
  let options = {
    SDKAppID: 1400325645 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
  }
  let tim = TIM.create(options) // SDK 实例通常用 tim 表示
  // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
  tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
  // tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

  // 将腾讯云对象存储服务 SDK （以下简称 COS SDK）注册为插件，IM SDK 发送文件、图片等消息时，需要用到腾讯云的 COS 服务
  // HTML5 环境，注册 COS SDK
  tim.registerPlugin({'cos-js-sdk': COS})
  export default {
    name: 'ImDemo',
    data() {
      return {
        uid: '8',
        userSig: 'eJyrVgrxCdZLrSjILEpVsjI0NTU1MjAw0AGLlqUWKVkpGekZKEH4xSnZiQUFmSlAdSYGBsZGpmYmphCZzJTUvJLMtEywBguY8sx0IC89OSs4KMQv1DjXxDEyLDc8NTvbs6ggJD08JCDPqMQv1U0-SDsjMFDbN9TTFqqxJDMX7BYLEzMDA1MDw1oAR6oveg__',
        groupId: '@TGS#3ANSJLIGJ',
        msg:''
      }
    },
    methods: {
      login() {
        let promise = tim.login({userID: this.uid, userSig: this.userSig})
        promise.then(function (imResponse) {
          console.log(imResponse.data) // 登录成功
          if (imResponse.data.repeatLogin === true) {
            // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
            console.log(imResponse.data.errorInfo)
          }
        }).catch(function (imError) {
          console.warn('login error:', imError) // 登录失败的相关信息
        })
      },
      logout(){
        let promise = tim.logout();
        promise.then(function(imResponse) {
          console.log(imResponse.data); // 登出成功
        }).catch(function(imError) {
          console.warn('logout error:', imError);
        });
      },
      getGroupList() {
        let promise = tim.getGroupList();
        promise.then(function (imResponse) {
          console.log(imResponse.data.groupList); // 群组列表
        }).catch(function (imError) {
          console.warn('getGroupList error:', imError); // 获取群组列表失败的相关信息
        });
      },
      joinGroup() {
        let promise = tim.joinGroup({groupID: this.groupId, type: TIM.TYPES.GRP_AVCHATROOM});
        promise.then(function (imResponse) {
          switch (imResponse.data.status) {
            case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
              break;
            case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
              console.log(imResponse.data.group); // 加入的群组资料
              break;
            case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
              break;
            default:
              break;
          }
        }).catch(function (imError) {
          console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
        });
      },
      quitGroup() {
        let promise = tim.quitGroup(this.groupId);
        promise.then(function (imResponse) {
          console.log(imResponse.data.groupID); // 退出成功的群 ID
        }).catch(function (imError) {
          console.warn('quitGroup error:', imError); // 退出群组失败的相关信息
        });
      },
      sendGroupMessage() {
        // 发送文本消息，Web 端与小程序端相同
// 1. 创建消息实例，接口返回的实例可以上屏
        let message = tim.createTextMessage({
          to: this.groupId,
          conversationType: TIM.TYPES.CONV_GROUP,
          // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
          // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
          // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
          payload: {
            text: this.msg
          }
        });
// 2. 发送消息
        let promise = tim.sendMessage(message);
        promise.then(function (imResponse) {
          // 发送成功
          console.log('发送成功');
          console.log(imResponse);
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError);
        });
      }
    }
  }
</script>

<style scoped>

</style>

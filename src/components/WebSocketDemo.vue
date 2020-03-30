<template>
  <div>
    <div>
      <el-input v-model="user" placeholder="请注册姓名"/>
      <el-button type="primary" @click="connect()">连接</el-button>
    </div>
    <div>
      <el-input v-model="msg" placeholder="请输入内容"/>
      <el-button type="primary" @click="sendServer(msg)">发到服务器</el-button>
      <el-button type="primary" @click="sendAllUser(msg)">群发</el-button>
      <el-input v-model="toUser" placeholder="请输入接收人姓名"/>
      <el-input v-model="privateMsg" placeholder="请输入私聊消息"/>
      <el-button type="primary" @click="sendUser(privateMsg)">私聊</el-button>
    </div>

  </div>
</template>

<script>
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';

  export default {
    name: "WebSocketDemo",
    data() {
      return {
        path: "http://localhost:20008/webSocket",
        socket: null,
        stompClient: null,
        msg: null,
        privateMsg: null,
        user: null,
        toUser:null
      }
    },
    destroyed() {
     // this.socket.close() //离开路由之后断开websocket连接
    },
    methods: {
      connect() {
        // 建立连接对象
        this.socket = new SockJS(this.path+'?token='+this.user);//连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        this.socket.onclose = this.close;
        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(this.socket);
        // 定义客户端的认证信息,按需求配置
        let headers = {
          name: '123',
        };
         //向服务器发起websocket连接
        this.stompClient.connect(JSON.stringify({name:'this.toUser',msg:'msg'}), this.subscribe, this.error);
        //this.stompClient.connect(headers, this.onUserMsg, this.error);

      },
      subscribe(frame) {
        console.log('Connected:' + frame);
        this.stompClient.subscribe('/topic/sendTopic', (msg) => { // 订阅服务端提供的某个topic
          console.log("topic接收消息")
          console.log(msg.body);  // msg.body存放的是服务端发送给我们的信息
        });
        this.stompClient.subscribe('/user/queue/sendUser', (msg) => { // 订阅服务端提供的某个topic
          console.log("user接收消息")
          console.log(msg.body);  // msg.body存放的是服务端发送给我们的信息
        });
      },
      open() {
        console.log("socket连接成功")
      },
      error(err) {
        console.log("连接错误");
        console.log(err);
      },
      getMessage(msg) {
        //console.log(msg)
      },
      close() {
        console.log("连接关闭")
      },
      sendServer(msg) {
        //发送消息的路径,由客户端发送消息到服务端
        this.stompClient.send("/sendServer", {}, msg);
      },
      sendAllUser(msg) {
        // 发送给所有广播sendTopic的人,客户端发消息，大家都接收，相当于直播说话 注：连接需开启 /topic/sendTopic
        this.stompClient.send("/sendAllUser", {}, this.msg);
      },
      sendUser(msg) {
        /* 这边需要注意，需要启动不同的前端html进行测试，需要改不同token ，例如 token=1234，token=4567
        * 然后可以通过写入name 为token  进行指定用户发送
        */
        this.stompClient.send("/sendMyUser", {}, JSON.stringify({name:this.toUser,msg:msg}));
      }

    }
  }
</script>

<style scoped>

</style>

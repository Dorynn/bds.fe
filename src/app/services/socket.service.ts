import { Injectable } from '@angular/core';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import  io from 'socket.io-client';

// var SockJs = require("sockjs");
// var Stomp = require("stompjs");

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(  ) { }
  // socket = io("http://localhost:8686/ws");

  connect(){
    let socket = new SockJS.default('http://localhost:8686/ws');
    let stompClient= Stomp.over(socket);
    return stompClient;
  }


}

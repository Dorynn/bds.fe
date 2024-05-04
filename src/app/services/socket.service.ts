import { Injectable } from '@angular/core';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor() { }
  connect() {
    let socket = new SockJS.default('http://localhost:8686/ws');
    let stompClient = Stomp.over(socket);
    return stompClient;
  }
}

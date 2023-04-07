import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Lightworks';
  private socket: any;

  ngOnInit() {
    this.socket = io('http://localhost:7778');

    // send a message to the server
    this.socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

    // receive a message from the server
    this.socket.on("hello from server", () => {
      // ...
      console.log("Hello from server");
    });

    // this.socket.on('event', (data: any) => {
    //   console.log(data);
    // });
  }
}

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import * as p5 from 'p5';

@Component({
  selector: 'app-team-tree',
  templateUrl: './team-tree.component.html',
  styleUrls: ['./team-tree.component.less']
})
export class TeamTreeComponent implements OnInit, OnDestroy {
  p5: any;
  private socket: any;
  mouseX: number;
  mouseY: number;

  @ViewChild('canvas') canvas: ElementRef | undefined;

  teamTreeImg: any;

  constructor() {
    this.mouseX = 0;
    this.mouseY = 0;
  }

  ngOnInit() {

    // Event handlers
    this.p5 = new p5(this.sketch, this.canvas?.nativeElement);

    this.canvas?.nativeElement.addEventListener('mousemove', this.mouseMoved);

    this.socket = io('http://localhost:7778');

    // send a message to the server
    this.socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

    // receive a message from the server
    this.socket.on("hello from server", () => {
      // ...
      console.log("Hello from server");
    });

    // listen for the "mouse" event from the server
    this.socket.on("mouse", (data: { x: any; y: any; }) => {
      // update the cursor position based on the data received
      this.cursor(data.x, data.y);
    });

    // this.socket.on('event', (data: any) => {
    //   console.log(data);
    // });
  }

  ngOnDestroy(): void {
    this.canvas?.nativeElement.removeEventListener('mousemove', this.mouseMoved);
  }

  cursor(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  canvasRef: any;
  sketch(p: any) {  
    p.setup = function() {
      this.canvasRef = p.createCanvas(1920, 1280);
      this.canvasRef.position(0,0);
      this.canvasRef.style("z-index", -1);
      this.imageMode(p.CENTER);
    };
  
    p.draw = function() {
      p.background(255);
      p.fill(0);
      p.circle(this.mouseX, this.mouseY, 50);
      p.image(this.teamTreeImg, 900, 610, 200, 150);
    };

    p.preload = function() {
      this.teamTreeImg = p.loadImage('../../assets/sprout.png');
    };
  }

  mouseMoved() {
    // emit the "mouse" event to the server with the current mouse position
    this.socket.emit('mouse', { x: this.mouseX, y: this.mouseY });
  }
}

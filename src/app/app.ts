import { Component } from '@angular/core';
import {ProselyteHome} from "./component/proselyte-home/proselyte-home";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProselyteHome, RouterOutlet],
  templateUrl: './app.html'
})
export class App {}
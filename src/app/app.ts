import {afterNextRender, Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  private audio: HTMLAudioElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.audio = document.getElementById('bgMusic') as HTMLAudioElement;
      if (this.audio) {
        this.audio.muted = true;
        this.audio.play().catch(() => {});

        const unmuteOnce = () => {
          if (this.audio) {
            this.audio.muted = false;
          }
          document.removeEventListener('click', unmuteOnce);
          document.removeEventListener('keydown', unmuteOnce);
        };

        document.addEventListener('click', unmuteOnce);
        document.addEventListener('keydown', unmuteOnce);
      }
    });
  }
}
import {afterNextRender, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Footer } from '../shared/footer/footer';
import {PrescriptGeneratorService} from "../../services/Prescript.generator";

@Component({
  selector: 'app-prescript-message',
  imports: [Footer],
  templateUrl: './prescript-message.html',
  styleUrl: './prescript-message.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrescriptMessage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly generator = inject(PrescriptGeneratorService);

  protected readonly userName = signal('');
  protected readonly prescriptText = signal('');
  protected readonly isTyping = signal(false);
  protected readonly isCleared = signal(false);

  private readonly tickMs = 50;
  private readonly noiseChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.';

  private decryptTimer: ReturnType<typeof setInterval> | null = null;
  private fullText = '';
  private revealedCount = 0;

  private beeper: HTMLAudioElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.beeper = new Audio('audio/index beeperprescript.wav');
      this.beeper.volume = 0.6;
    });
  }

  ngOnInit(): void {
    const raw = history.state;
    const name =
        typeof raw?.name === 'string' && raw.name.length <= 100
            ? raw.name.trim()
            : 'Unknown';
    this.userName.set(name || 'Unknown');
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.beeper = null;
  }

  protected namePrefix(): string {
    return '【To ' + this.userName() + '】';
  }

  private clearTimer(): void {
    if (this.decryptTimer !== null) {
      clearInterval(this.decryptTimer);
      this.decryptTimer = null;
    }
  }

  private playBeep(): void {
    if (!this.beeper) return;
    this.beeper.currentTime = 0;
    this.beeper.play().catch(() => {});
  }

  private randomNoiseChar(): string {
    return this.noiseChars[Math.floor(Math.random() * this.noiseChars.length)];
  }

  private buildFrame(): string {
    let frame = '';
    for (let i = 0; i < this.fullText.length; i++) {
      const char = this.fullText[i];

      if (i < this.revealedCount) {
        frame += char;
      } else if (char === ' ') {
        frame += ' ';
      } else {
        frame += this.randomNoiseChar();
      }
    }
    return frame;
  }

  private startDecryptEffect(text: string): void {
    this.clearTimer();

    this.fullText = text;
    this.revealedCount = 0;
    this.isTyping.set(true);
    this.prescriptText.set(this.buildFrame());

    this.decryptTimer = setInterval(() => {
      if (this.revealedCount < this.fullText.length) {

        while (
            this.revealedCount < this.fullText.length &&
            this.fullText[this.revealedCount] === ' '
            ) {
          this.revealedCount++;
        }

        this.revealedCount++;
      }

      this.prescriptText.set(this.buildFrame());

      if (this.revealedCount >= this.fullText.length) {
        this.clearTimer();
        this.isTyping.set(false);
      }
    }, this.tickMs);
  }

  protected clearPrescript(): void {
    this.clearTimer();
    this.prescriptText.set('【_CLEAR._】');
    this.isTyping.set(false);
    this.isCleared.set(true);
  }

  protected newPrescriptDisplay(): void {
    this.isCleared.set(false);
    this.playBeep();
    this.startDecryptEffect(this.generator.generate());
  }
}
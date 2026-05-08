import {ChangeDetectionStrategy, Component, computed, inject} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {storageSignal} from "../../utility/storage-signal";
import {Footer} from "../shared/footer/footer";
import {Header} from "../shared/header/header";
import {Router} from "@angular/router";

@Component({
  selector: "app-proselyte-home",
  imports: [
    ReactiveFormsModule,
    Footer,
    Header
  ],
  templateUrl: "./proselyte-home.html",
  styleUrl: "./proselyte-home.css",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProselyteHome {
  protected readonly savedName = storageSignal('name');
  private readonly router = inject(Router);
  protected SAFE_PATTERN = /^[\p{L}\p{N}\s\-_'.]+$/u;

  protected readonly hasName  = computed(() => this.savedName() !== null);
  protected readonly greeting = computed(() => this.getPreludeText(this.savedName()));

  protected readonly nameForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(50),
        Validators.pattern(/^[\p{L}\p{N}\s\-_'.]*$/u)
      ]
    })
  });

  protected registerName(): void {
    const typed = this.nameForm.controls.name.value.trim();
    if (typed.length > 50 || (typed && !this.SAFE_PATTERN.test(typed))) return;
    this.savedName.set(typed || 'an Index Proselyte');
    this.nameForm.reset();
  }

  protected clearName(): void {
    this.savedName.set(null);
    this.nameForm.reset({ name: '' });
  }

  protected drawPrescript() {
      this.router.navigate(['/prescript'], {
        state: {
          name: this.savedName()
        }
      });
  }

  private getPreludeText(nameValue: string | null): string {
    const nameChosen = (nameValue ?? '').toLowerCase();

    if (nameChosen === 'yan') {
      return this.pick([
        'Greetings, Messenger.',
        'Remain steadfast, Messenger.',
        'Remember what this is all for.',
        'Are you losing faith?',
        'Draw a Prescript.'
      ]);
    }

    if (nameChosen === 'rien') {
      return this.pick([
        'Greetings, Oracle.',
        'How has your daughter been, Oracle?',
        'Hermes greets you.',
        'That is that, and this is this.',
        'Draw a Prescript.'
      ]);
    }

    if (
        nameChosen === 'gloria' ||
        nameChosen === 'esther' ||
        nameChosen === 'hubert' ||
        nameChosen === 'sora' ||
        nameChosen === 'an index proxy'
    ) {
      return this.pick([
        'Greetings, Proxy.',
        'Let not your heart falter, Proxy.',
        'Draw a Prescript.',
        'Hold faith in the Will of the City, Proxy.'
      ]);
    }

    if (nameChosen === 'angela') {
      return 'Even a machine needs something to believe in.';
    }

    if (nameChosen === 'roland') {
      return "Oh. It's you.";
    }

    if (nameChosen === 'faust') {
      return 'Greetings, Proselyte.';
    }

    if (nameChosen === 'moirai') {
      return "You are no exception to the City's volition.";
    }

    if (nameChosen === 'mobius' || nameChosen === 'moebius') {
      return "Identity theft isn't funny. Please change your name.";
    }

    if (nameChosen === 'hermes') {
      return 'A blasphemer, are you?';
    }

    return 'Draw a Prescript.';
  }

  private pick(list: readonly string[]): string {
    return list[Math.floor(Math.random() * list.length)];
  }
}
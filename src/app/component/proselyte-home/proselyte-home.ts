import {afterNextRender, Component, computed, signal} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: "app-proselyte-home",
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: "./proselyte-home.html",
  styleUrl: "./proselyte-home.css",
})

export class ProselyteHome {
  private readonly storageNameKey = 'name';

  protected readonly nameForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(50)]
    })
  });

  protected readonly savedName = signal<string | null>(null);
  protected readonly greeting = signal<string>('');

  constructor() {
    afterNextRender(() => {
      const storedName = localStorage.getItem(this.storageNameKey);
      if (storedName) {
        this.savedName.set(storedName);
        this.greeting.set(this.getPreludeText(storedName));
      }
    });
  }

  protected hasName(): boolean {
    return this.savedName() !== null;
  }

  protected registerName(): void {
    const typedValue = this.nameForm.controls.name.value.trim();
    const finalName = typedValue === '' ? 'an Index Proselyte' : typedValue;

    localStorage.setItem(this.storageNameKey, finalName);

    this.savedName.set(finalName);
    this.greeting.set(this.getPreludeText(finalName));
  }

  protected clearName(): void {
    localStorage.removeItem(this.storageNameKey);
    this.savedName.set(null);
    this.greeting.set('');
    this.nameForm.reset({ name: '' });
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
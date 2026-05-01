import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Footer} from "../shared/footer/footer";

@Component({
  selector: 'app-prescript-message',
  imports: [
    Footer
  ],
  templateUrl: './prescript-message.html',
  styleUrl: './prescript-message.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrescriptMessage {
  private readonly route = inject(ActivatedRoute);

  protected userName = '';


  ngOnInit() {
    const state = history.state as { name?: string };
    this.userName = state.name ?? 'Unknown';
  }

  protected NamePrefix() {
    return "【To " + this.userName + "】";
  }

  protected clearPrescript() {

  }

  protected newPrescriptDisplay() {

  }
}

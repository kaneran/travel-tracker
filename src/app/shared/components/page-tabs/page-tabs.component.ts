import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-tabs.component.html',
  //   template: `
  //   <div>
  // <div class="tab">
  //     @for(tab of tabs; track tab.name){
  //         <button class="tablinks" (click)="template=tab.name">{{tab.name}}</button>
  //     }
  // </div>
  // @for(tab of tabs; track tab.name){
  //        @if(template==tab.name){
  //         <div [innerHTML]="tab.component"></div>
  //        }
  //     }
  // </div>
  //   `,
  styleUrl: './page-tabs.component.scss'
})
export class PageTabsComponent {
  @Input() tabs: IPageTab[];
  @Output() selectedTab = new EventEmitter<string>();
  tabSelected: string;


  handleTabSelectedEvent(tab: string) {
    this.selectedTab.emit(tab);
    this.tabSelected = tab;
  }
}


export interface IPageTab {
  name: string,
  component: string
}

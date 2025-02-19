import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent implements OnInit {
  @Input() visited: number;
  @Input() goal: number;
  @Input() title: string;

  progress: number;

  ngOnInit(): void {
    this.progress = this.visited / this.goal * 100;
  }
}

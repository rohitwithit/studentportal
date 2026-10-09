import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.css',
  template: '<router-outlet/>',
})
export class App {
  protected readonly title = signal('client');
}

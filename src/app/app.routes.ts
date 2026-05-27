import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';  // Standalone
import { AboutComponent } from './about/about.component';  // Standalone
import { IndexComponent } from './index/index.component';  // Non-standalone
import { CustomComponent } from './custom/custom.component';  // Standalone

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Default route
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'index', component: IndexComponent },
  { path: 'custom', component: CustomComponent },
  { path: '**', redirectTo: '/home' },
];

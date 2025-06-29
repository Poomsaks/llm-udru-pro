import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LlmUdruComponent } from './llm-udru/llm-udru.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'llm-udru', component: LlmUdruComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

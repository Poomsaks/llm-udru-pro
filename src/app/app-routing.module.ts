import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LlmUdruComponent } from './llm-udru/llm-udru.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'llm-udru', component: LlmUdruComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

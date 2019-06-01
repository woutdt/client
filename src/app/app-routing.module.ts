import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { AccountComponent } from './account/account.component';
import { RapportComponent } from './rapport/rapport.component';

const routes: Routes = [
  { path: 'signin' , component: SigninComponent },
  { path: '',   redirectTo: '/signin', pathMatch: 'full' },
  { path: 'authenticated' , component: AuthenticatedComponent },
  { path: 'account', component: AccountComponent },
  { path: 'rapport', component: RapportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

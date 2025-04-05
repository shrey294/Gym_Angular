import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ListuserComponent } from './listuser/listuser.component';
import { UserdetailComponent } from './userdetail/userdetail.component';

const routes: Routes = [
  {path:'',redirectTo:'register',pathMatch:'full'},
  {path:'register',component:RegistrationComponent},
  {path:'list',component:ListuserComponent},
  {path:'update/:id',component:RegistrationComponent},
  {path:'details/:id',component:UserdetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

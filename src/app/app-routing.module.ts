import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard, AuthGuard, childGuard } from './guards/auth.guard';
import { AdminComponent } from './modules/main/admin/admin.component';
import { MainComponent } from './modules/main/main.component';
import { UserComponent } from './modules/main/user/user.component';
import { AddAreaComponent } from './pages/admin/add-area/add-area.component';
import { AddLandComponent } from './pages/admin/add-land/add-land.component';
import { AddProjectComponent } from './pages/admin/add-project/add-project.component';
import { AreaManagementComponent } from './pages/admin/area-management/area-management.component';
import { EditAreaComponent } from './pages/admin/edit-area/edit-area.component';
import { EditLandComponent } from './pages/admin/edit-land/edit-land.component';
import { EditProjectComponent } from './pages/admin/edit-project/edit-project.component';
import { LandManagementComponent } from './pages/admin/land-management/land-management.component';
import { ProjectManagerComponent } from './pages/admin/project-manager/project-manager.component';
import { TransactionManagementComponent } from './pages/admin/transaction-management/transaction-management.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { ViewTransactionComponent } from './pages/admin/view-transaction/view-transaction.component';
import { AreaDetailComponent } from './pages/user/area-detail/area-detail.component';
import { HomepageComponent } from './pages/user/homepage/homepage.component';
import { ProjectDetailComponent } from './pages/user/project-detail/project-detail.component';
import { TransactionHistoryComponent } from './pages/user/transaction-history/transaction-history.component';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '' },
  // {
  //   path: '',
  //   component: MainComponent,
  //   // canActivate: [AuthGuard],

  // },
  {
    path: '',
    component: MainComponent,
    // canActivate: [authGuard],
    // canActivateChild: [childGuard],
    children: [
      {
        path: '',
        children: [
          {
            path: 'homepage',
            component: HomepageComponent
          },
          {
            path: 'project-detail/:id',
            component: ProjectDetailComponent
          },
          {
            path: 'project-detail/:id/area-detail/:area-id',
            component: AreaDetailComponent
          },
          
          // {
          //   path: 'add-project',
          //   component: AddProjectComponent
          // },
          // {
          //   path: 'project-management',
          //   component: ProjectManagerComponent
          // },
          // {
          //   path: 'area-management',
          //   component: AreaManagementComponent
          // },
          // {
          //   path: 'add-area',
          //   component: AddAreaComponent
          // },
          // {
          //   path: 'edit-area/:id',
          //   component: EditAreaComponent
          // },
          // {
          //   path: 'edit-project/:id',
          //   component: EditProjectComponent
          // },
          // {
          //   path: 'land-management',
          //   component: LandManagementComponent
          // },
          // {
          //   path: 'add-land',
          //   component: AddLandComponent
          // },
          // {
          //   path: 'edit-land/:id',
          //   component: EditLandComponent
          // },
          // {
          //   path: 'transaction-management',
          //   component: TransactionManagementComponent
          // },
          // {
          //   path: 'view-transaction/:id',
          //   component: ViewTransactionComponent
          // },
          // {
          //   path: 'user',
          //   component: UserListComponent
          // },
          {
            path: 'transaction-history',
            component: TransactionHistoryComponent
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

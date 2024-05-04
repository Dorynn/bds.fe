import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './modules/main/main.component';
import { AreaDetailComponent } from './pages/user/area-detail/area-detail.component';
import { HomepageComponent } from './pages/user/homepage/homepage.component';
import { ProjectDetailComponent } from './pages/user/project-detail/project-detail.component';
import { TransactionHistoryComponent } from './pages/user/transaction-history/transaction-history.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
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

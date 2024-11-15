import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { ContactsComponent } from './components/contacts/contacts.component';

export const routes: Routes = [
  { path: '', redirectTo: '/kanban-board', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'kanban-board', component: KanbanBoardComponent },
  { path: 'contacts', component: ContactsComponent },
];

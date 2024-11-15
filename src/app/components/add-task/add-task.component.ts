import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ContactService } from '../../services/contact.service';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  initials: string;
}

interface Task {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignees: string[];
  dueDate: string;
  subtasks: Subtask[];
}

interface Subtask {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  newTask: Task = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignees: [],
    dueDate: '',
    subtasks: [],
  };
  newSubtask: Subtask = {
    title: '',
    completed: false,
  };
  contacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  dropdownOpen: boolean = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private contactService: ContactService
  ) {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe((contacts) => {
      this.contacts = contacts.map((contact) => ({
        ...contact,
        initials:
          contact.firstName.charAt(0).toUpperCase() +
          contact.lastName.charAt(0).toUpperCase(),
      }));
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      this.closeDropdown();
    }
  }

  toggleUserSelection(user: Contact): void {
    const index = this.selectedContacts.findIndex((u) => u.id === user.id);
    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(user);
    }
  }

  getSelectedContactsDisplay(): string {
    return this.selectedContacts.length
      ? this.selectedContacts
          .map((c) => `${c.firstName} ${c.lastName}`)
          .join(', ')
      : 'Select users';
  }

  isSelected(user: Contact): boolean {
    return this.selectedContacts.some((u) => u.id === user.id);
  }

  addTask(): void {
    if (this.newTask.title && this.newTask.description) {
      this.newTask.assignees = this.selectedContacts.map(
        (c) => `${c.firstName} ${c.lastName}`
      );
      this.taskService.addTask(this.newTask).subscribe(() => {
        this.router.navigate(['/kanban-board']);
      });
    }
  }

  addSubtask(): void {
    if (this.newSubtask.title) {
      this.newTask.subtasks.push({ ...this.newSubtask });
      this.newSubtask = { title: '', completed: false };
    }
  }

  editSubtask(subtaskTitle: string): void {
    const index = this.newTask.subtasks.findIndex(
      (s) => s.title === subtaskTitle
    );
    if (index > -1) {
      this.newSubtask = { ...this.newTask.subtasks[index] };
      this.newTask.subtasks.splice(index, 1);
    }
  }

  deleteSubtask(subtaskTitle: string): void {
    const index = this.newTask.subtasks.findIndex(
      (s) => s.title === subtaskTitle
    );
    if (index > -1) {
      this.newTask.subtasks.splice(index, 1);
    }
  }
}

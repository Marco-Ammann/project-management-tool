import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubtaskComponent } from './subtask/subtask.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignees: string[];
  subtasks: Subtask[];
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, SubtaskComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() delete = new EventEmitter<Task>();
  @Output() update = new EventEmitter<Task>();

  isEditing: boolean = false;
  editedTask: Task = {} as Task;

  editTask() {
    this.isEditing = true;
    this.editedTask = { ...this.task };
  }

  saveTask() {
    this.isEditing = false;
    this.update.emit(this.editedTask);
  }

  cancelEdit() {
    this.isEditing = false;
  }

  deleteTask() {
    this.delete.emit(this.task);
  }

  // Handle subtask updates and deletions
  onSubtaskUpdated(subtask: Subtask) {
    const index = this.task.subtasks.findIndex((s) => s.id === subtask.id);
    if (index !== -1) {
      this.task.subtasks[index] = subtask;
      this.update.emit(this.task);
    }
  }

  onSubtaskDeleted(subtask: Subtask) {
    const index = this.task.subtasks.findIndex((s) => s.id === subtask.id);
    if (index !== -1) {
      this.task.subtasks.splice(index, 1);
      this.update.emit(this.task);
    }
  }

  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('application/json', JSON.stringify(this.task));
  }
}

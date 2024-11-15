import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subtask.component.html',
  styleUrls: ['./subtask.component.scss'],
})
export class SubtaskComponent {
  @Input() subtask!: Subtask;
  @Output() subtaskUpdated = new EventEmitter<Subtask>();
  @Output() subtaskDeleted = new EventEmitter<Subtask>();

  isEditing: boolean = false;
  editedSubtask: Subtask = {} as Subtask;

  toggleSubtaskCompletion() {
    this.subtask.completed = !this.subtask.completed;
    this.subtaskUpdated.emit(this.subtask);
  }

  editSubtask() {
    this.isEditing = true;
    this.editedSubtask = { ...this.subtask };
  }

  saveSubtask() {
    this.isEditing = false;
    Object.assign(this.subtask, this.editedSubtask);
    this.subtaskUpdated.emit(this.subtask);
  }

  cancelEdit() {
    this.isEditing = false;
  }

  deleteSubtask() {
    this.subtaskDeleted.emit(this.subtask);
  }
}

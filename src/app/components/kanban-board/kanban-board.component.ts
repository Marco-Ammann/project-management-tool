import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskComponent } from './task/task.component';

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
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, TaskComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent implements OnInit {
  tasks: Task[] = [];
  hoveredColumn: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      const taskData: Task = JSON.parse(data);
      const task = this.tasks.find((t) => t.id === taskData.id);
      if (task) {
        this.moveTask(task, newStatus);
      }
    }
    this.hoveredColumn = null;
  }

  allowDrop(event: DragEvent, columnStatus: string) {
    event.preventDefault();
    this.hoveredColumn = columnStatus;
  }

  onDragLeave(event: DragEvent) {
    this.hoveredColumn = null;
  }

  isColumnHovered(status: string): boolean {
    return this.hoveredColumn === status;
  }

  moveTask(task: Task, newStatus: string): void {
    if (task.status !== newStatus) {
      const updatedTask = { ...task, status: newStatus };
      this.taskService.updateTask(updatedTask).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  onDeleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.loadTasks();
    });
  }

  onUpdateTask(updatedTask: Task) {
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }
}

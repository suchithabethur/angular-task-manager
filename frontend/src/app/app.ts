import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from './task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Task Manager';
  tasks: any[] = [];
  newTask = '';
  editingTask: any = null;
  isLoading = false;
  deletingTaskId: number | null = null;


  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data: any) => {
        console.log('Tasks loaded:', data);
        this.tasks = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

addTask() {
  if (!this.newTask.trim() || this.isLoading) {
    return;
  }

  this.isLoading = true;

  const title = this.newTask.trim();
  this.newTask = "";

  this.taskService.addTask({ title }).subscribe({
    next: (res) => {
      // Add immediately to the list
      this.tasks.push(res);
        this.loadTasks();

      this.isLoading = false;
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}

  deleteTask(id: number) {
    if (this.isLoading || this.deletingTaskId === id) return;
    
    this.deletingTaskId = id;
    this.isLoading = true;
    this.loadTasks(); // Ensure the list is up-to-date before deletion

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.isLoading = false;
        this.deletingTaskId = null;
        // Remove task from local array immediately
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.cdr.detectChanges();
        // Optionally refresh from server (uncomment if needed)
        // this.loadTasks();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.isLoading = false;
        this.deletingTaskId = null;
        this.loadTasks(); // Reload to ensure consistency
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(task: any) {
    if (this.isLoading) return;
    this.editingTask = { ...task };
    this.cdr.detectChanges();

    
    setTimeout(() => {
      const input = document.querySelector('.edit-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  saveEdit() {
    if (!this.editingTask?.title.trim() || this.isLoading) return;
    
    this.isLoading = true;
    this.loadTasks(); // Ensure the list is up-to-date before editing
    const updatedTitle = this.editingTask.title.trim();
    const taskId = this.editingTask.id;
    
    this.taskService.editTask(taskId, { title: updatedTitle }).subscribe({
      next: () => {
        this.isLoading = false;
        // Update local array immediately
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          this.tasks[index].title = updatedTitle;
        }
        this.editingTask = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error editing task:', error);
        this.isLoading = false;
        this.loadTasks();
        this.cdr.detectChanges();
      }
    });
  }

  cancelEdit() {
    this.editingTask = null;
    this.cdr.detectChanges();
    this.loadTasks(); // Reload to ensure consistency
  }

  
logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
}
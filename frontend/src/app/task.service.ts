import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl ='https://automatic-spoon-v6q6j5pxrv7qcpjwp-3000.app.github.dev/tasks';
  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  editTask(id: number, data: { title: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

}
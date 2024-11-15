import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3001/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addContact(contact: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contact);
  }

  updateContact(contact: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${contact.id}`, contact);
  }

  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

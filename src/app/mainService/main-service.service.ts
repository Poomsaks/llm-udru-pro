import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {
  constructor(private http: HttpClient) { }

  listDoc(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${environment.API_URL}/list_doc`, { headers });
  }
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${environment.API_URL}/uploadFile`, formData);
  }
  saveChat(message: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/save_chat`, message);
  }
  getChatSources(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/get_chat_sources`);
  }
  getChatsBySource(sourceId: number): Observable<any> {
    return this.http.get(`${environment.API_URL}/get_chats_by_source/${sourceId}`);
  }
  generate(query: string, files: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {
      query: query,
      files: files
    };
    return this.http.post<any>(`${environment.API_URL}/generate`, body, { headers });
  }
  updateSelectedFiles(payload: { files: string[], is_active: boolean }): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/update_status`, payload);
  }
  getStats(): Observable<any> {
    return this.http.get(`${environment.API_URL}/stats`);
  }

}

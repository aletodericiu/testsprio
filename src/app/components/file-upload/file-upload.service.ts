import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FileUploadService {

  private headers: Headers;

  constructor(private httpClient: Http) {
      this.headers = new Headers();
      // this.headers.append('Content-Type', 'multipart/form-data');

  }

    postFile(fileToUpload: File): Observable<boolean> {
        
       const endpoint = 'http://localhost:8080/post';
       const formData: FormData = new FormData();
       formData.append('filename', fileToUpload, fileToUpload.name);
       return this.httpClient
           .post(endpoint, formData, {headers: this.headers})
           .map(data => data.json());


    }

}

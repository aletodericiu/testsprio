import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class FileUploadService {

  private headers: Headers;

  constructor(private httpClient: HttpClient) {

  }

    postFile(fileToUpload: File): Observable<any> {

        const headers = new HttpHeaders();
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Accept', 'multipart/form-data');

        const endpoint = 'http://localhost:8080/post';
        const formData: FormData = new FormData();
        formData.append('filename', fileToUpload, fileToUpload.name);
        return this.httpClient
            .post(endpoint, formData, {headers: headers});


    }

}

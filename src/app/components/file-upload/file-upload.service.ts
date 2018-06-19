import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class FileUploadService {

  private headers: Headers;

  constructor(private httpClient: Http) {
      this.headers = new Headers();
  }

    postFile(fileToUpload: File): Observable<any> {

        // const endpoint = 'http://192.168.166.145:8080/post';
        const endpoint = 'http://localhost:8080/post';
        const formData: FormData = new FormData();
        formData.append('filename', fileToUpload, fileToUpload.name);
        return this.httpClient
            .post(endpoint, formData, {headers: this.headers});


    }

}

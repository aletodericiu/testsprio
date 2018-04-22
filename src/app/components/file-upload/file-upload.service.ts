import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FileUploadService {

  private headers: Headers;

  constructor(private httpClient: Http) {
      this.headers = new Headers();
      this.headers.append('Content-Type', 'multipart/form-data');

  }

    postFile(fileToUpload: File): Observable<boolean> {
        const endpoint = 'api endpoint url';
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        return this.httpClient
            .post(endpoint, formData, {headers: this.headers})
            .map(data => data.json());
    }

}

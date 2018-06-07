import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { Subscriber } from 'rxjs/Subscriber';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit, OnDestroy {
    @Output() fileUploaded = new EventEmitter();

    fileToUpload: File = null;
    spin: boolean;
    selectedFileName: string;
    uploadSuccessful: boolean;
    subscriber: any;
    showFileErrMsg: boolean;
    private headers: Headers;

    constructor(private fileUploadService: FileUploadService, private httpClient: HttpClient) {
        this.headers = new Headers();
    }

    ngOnInit() {
    }

    handleFileInput(files: FileList) {
        this.showFileErrMsg = false;
        this.uploadSuccessful = false;

        if (files.item(0).name.substring(files.item(0).name.lastIndexOf('.') + 1) === 'csv' ||
            files.item(0).name.substring(files.item(0).name.lastIndexOf('.') + 1) === 'txt' ||
            files.item(0).name.substring(files.item(0).name.lastIndexOf('.') + 1) === 'xls') {

            this.selectedFileName = files.item(0).name;
            this.fileToUpload = files.item(0);
        } else {
            this.showFileErrMsg = true;
        }
    }

    uploadFile() {
        this.spin = true;
        console.log(this.fileToUpload.type);

        this.subscriber = this.postFile(this.fileToUpload).subscribe(
            data => {
                console.log('upload successful', data);
                this.spin = false;
                this.uploadSuccessful = true;
                this.fileUploaded.emit(true);
                this.fileToUpload = null;
            },
            error => {
                console.error(error);
                this.spin = false;
                this.uploadSuccessful = false;
                this.fileToUpload = null;
                this.fileUploaded.emit(false);
            });
    }

    postFile(fileToUpload: File): Observable<any> {

        const heders = new Headers();
        const endpoint = 'http://localhost:8080/post';
        const formData: FormData = new FormData();
        formData.append('filename', fileToUpload, fileToUpload.name);
        return this.httpClient
            .post(endpoint, formData, {headers: new HttpHeaders()});


    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }
}

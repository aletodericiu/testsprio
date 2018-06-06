import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { Subscriber } from "rxjs/Subscriber";

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

    constructor(private fileUploadService: FileUploadService) { }

    ngOnInit() {
    }

    handleFileInput(files: FileList) {
        console.log(' files ', files);
        // this.fileToUpload = null;
        console.log('files.item(0)', files.item(0));
        this.selectedFileName = files.item(0).name;
        this.fileToUpload = files.item(0);
        this.uploadSuccessful = false;
    }

    uploadFile() {
        this.spin = true;
        console.log(this.fileToUpload.type);
        if (this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.') + 1) === 'csv' ||
            this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.') + 1) === 'txt' ||
            this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.') + 1) === 'xls') {
            this.subscriber = this.fileUploadService.postFile(this.fileToUpload).subscribe(
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
        } else {
            console.log(' not good enough for ale');
            this.fileToUpload = null;
            this.spin = false;
        }
    }
    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }
}

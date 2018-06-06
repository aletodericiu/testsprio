import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { Subscriber } from 'rxjs/Subscriber';

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

    constructor(private fileUploadService: FileUploadService) { }

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
    }
    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }
}

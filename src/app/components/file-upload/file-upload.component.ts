import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit {
    @Output() fileUploaded = new EventEmitter();

    fileToUpload: File = null;
    spin: boolean;
    selectedFileName: string;
    uploadSuccessful: boolean;

    constructor(private fileUploadService: FileUploadService) { }

    ngOnInit() {
    }

    handleFileInput(files: FileList) {
        console.log('files.item(0)', files.item(0));
        this.selectedFileName = files.item(0).name;
        this.fileToUpload = files.item(0);
    }

    uploadFile() {
        this.spin = true;

        if (this.fileToUpload.type === 'application/pdf') {
            console.log(' not good enough for ale');
            this.fileToUpload = null;
            this.spin = false;
        } else {
            this.fileUploadService.postFile(this.fileToUpload).subscribe(
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
    }

}

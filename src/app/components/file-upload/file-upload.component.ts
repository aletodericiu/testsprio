import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit {

    fileToUpload: File = null;

    constructor(private fileUploadService: FileUploadService) { }

    ngOnInit() {
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
    }

    uploadFile() {
        this.fileUploadService.postFile(this.fileToUpload).subscribe(
            data => {
                console.log('upload successful', data);
            },
            error => {
                console.log(error);
            });
    }

}

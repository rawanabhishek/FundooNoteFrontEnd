import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profiledialog',
  templateUrl: './profiledialog.component.html',
  styleUrls: ['./profiledialog.component.scss']
})
export class ProfiledialogComponent implements OnInit {

  profilePic: File;
  imagePath;


  constructor(
    private noteService: NoteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

  }



  onChangeUpload(picture) {
    this.profilePic = picture.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(picture.target.files[0]);
    reader.onload = (picture1) => {
      this.imagePath = reader.result;
    };

  }

  setProfilePic() {
    console.log('profile pic', this.profilePic);
    const uploadData = new FormData();
    uploadData.append('picture', this.profilePic, this.profilePic.name);
    this.noteService.setProfilePic(uploadData).subscribe(
      response => {

        this.snackBar.open(response.message, 'close')._dismissAfter(2000);


      },
      error => {
        this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);

      }
    );
  }

  removeProfilePic() {
    this.noteService.removeProfilePic().subscribe(
      response => {

        this.snackBar.open(response.message, 'close')._dismissAfter(2000);


      },
      error => {
        this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);

      }
    );
  }


}

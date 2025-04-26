import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Post } from '../post-list/post.model';
import { CommonModule } from '@angular/common';
import { PostService } from '../post-list/post.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule,MatInputModule, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {

  public enteredTitle!: string;
  public enteredContent!: string;

  constructor(private postService: PostService) {}
  
  public addPost(data: NgForm): void {
    if(data.invalid) {
      return;
    }

    this.postService.addPost(data.value.title,data.value.content);
    data.resetForm();
  }
}

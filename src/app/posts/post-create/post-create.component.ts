import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Post } from '../post-list/post.model';
import { CommonModule } from '@angular/common';
import { PostService } from '../post-list/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule,MatInputModule, MatButtonModule, MatCardModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {

  public enteredTitle!: string;
  public enteredContent!: string;
  private mode = "create";
  private postId!: string | null;
  public post!: any;
  public isLoading = false;

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has("postId")) {
        this.mode = "edit"
        this.postId = paramMap.get("postId")!;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData=> {
          this.isLoading = false;
          this.post = {id:postData._id, title: postData.title, content: postData.content}
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }
  
  public savePost(data: NgForm): void {
    if(data.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === "create") {
      this.postService.addPost(data.value.title,data.value.content);
    } else {
      this.postService.updatePost(this.postId!,data.value.title,data.value.content);
    }

    data.resetForm();
  }
}

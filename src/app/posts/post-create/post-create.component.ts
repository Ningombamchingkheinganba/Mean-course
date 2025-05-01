import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Post } from '../post-list/post.model';
import { CommonModule } from '@angular/common';
import { PostService } from '../post-list/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule,MatInputModule, MatButtonModule, MatCardModule, CommonModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {

  public enteredTitle!: string;
  public enteredContent!: string;
  private mode = "create";
  private postId!: string | null;
  public post!: Post;
  public isLoading = false;
  public imagePreview!: string;
  public form!: FormGroup;

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      "title" : new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]}),
      "content" : new FormControl(null, {validators: [Validators.required]}),
      "image": new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has("postId")) {
        this.mode = "edit"
        this.postId = paramMap.get("postId")!;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData=> {
          this.isLoading = false;
          this.post = {id:postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath}
          console.log("this.post", this.post);
          
          this.form.setValue(
            {"title": this.post.title,
            "content": this.post.content,
            "image": this.post.imagePath
          })
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  public onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({"image": file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
  
  public savePost(): void {
    if(this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === "create") {
      this.postService.addPost(this.form.value.title,this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId!,this.form.value.title, this.form.value.content, this.form.value.image);
    }

    this.form.reset();
  }
}

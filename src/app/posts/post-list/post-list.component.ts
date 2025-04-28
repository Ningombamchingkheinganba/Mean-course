import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatExpansionModule, CommonModule, MatButtonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {

  public posts: Post[] = [];
  private posSub!: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPost();
    this.postService.getPostUpdatedListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }

  ngOnDestroy(): void {
    this.posSub.unsubscribe();
  }

  onDelete(id: string): void {
    this.postService.deletePost(id);
  }

}

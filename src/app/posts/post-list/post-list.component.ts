import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { AuthService } from '../../auth/signup/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatExpansionModule, CommonModule, MatButtonModule, RouterLink, MatProgressSpinnerModule,MatPaginatorModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {

  public posts: Post[] = [];
  private posSub!: Subscription;
  public isLoading = false;
  public totalPosts = 0;
  public currentPage = 1;
  public postsPerPage = 2;
  public pageSizeOption = [1,2,5,10]
  public userIsAuthenticated: boolean = false;
  private authStatusSub!: Subscription;
  public userId!: string;

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId()!;
    this.posSub = this.postService
    .getPostUpdatedListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId()!;
    })
  }

  ngOnDestroy(): void {
    this.posSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(id: string): void {
    this.postService.deletePost(id).subscribe(()=> {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

}

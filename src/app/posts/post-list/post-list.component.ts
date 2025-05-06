import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { PageEvent} from '@angular/material/paginator';
import { AuthService } from '../../auth/signup/auth.service';
import { AngularMaterialModule } from '../../angular-material.module';
import { PostModule } from './posts.module';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [AngularMaterialModule, PostModule],
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
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(()=> {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    }, ()=> {
      this.isLoading = false;
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

}

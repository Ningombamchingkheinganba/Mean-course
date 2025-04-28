import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] =[];
  private postsUpdated = new Subject<Post[]>();


  constructor(private http: HttpClient) { }

  getPost() {
    this.http.get<{message:string, posts: Post[]}>("http://localhost:3000/api/posts")
    .pipe(map((postData: { posts: any[]; })=> {
      return postData.posts.map((post: any)=> {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPosts)=>{
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content:string) {
    const post:Post = {id:null,title: title, content:content};
    this.http.post<{message:string , postId:string}>("http://localhost:3000/api/posts", post).subscribe((responseData)=>{
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    })
  }

  deletePost(id:string) {
    this.http.delete<{message:string}>(`http://localhost:3000/api/posts/${id}`)
    .subscribe(()=> {
      const updatedPosts =  this.posts.filter(post => post.id !== id)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}

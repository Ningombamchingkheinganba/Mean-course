import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/signup/auth.guard';

export const routes: Routes = [
    {path: "", component: PostListComponent},
    {path: "create", component: PostCreateComponent, canActivate: [AuthGuard]},
    {path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard]},
    {path: 'auth',loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
];

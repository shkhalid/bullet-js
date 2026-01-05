import { Request } from '@bullet-js/http';
import { Post as PostModel } from '../models/Post';

export class PostController {
  async index(req: Request) {
    return await PostModel.all();
  }

  async store(req: Request) {
    const title = await req.input('title');
    const content = await req.input('content');
    
    if (!title) {
        return { error: 'Title is required' };
    }

    const post = await PostModel.create({
        title,
        content
    });

    return post.attributes;
  }
}

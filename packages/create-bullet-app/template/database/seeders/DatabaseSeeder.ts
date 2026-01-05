import { Post } from '../../src/models/Post';

export class DatabaseSeeder {
  async run() {
    console.log('Seeding Posts...');
    
    await Post.create({
      title: 'Seeded Post 1',
      content: 'Content for seeded post 1'
    });
    
    await Post.create({
      title: 'Seeded Post 2',
      content: 'Content for seeded post 2'
    });
    
    console.log('Posts seeded!');
  }
}

import { Request } from '@bullet-js/http';

export class UserController {
  async index(req: Request) {
    return 'List of items';
  }

  async store(req: Request) {
    return 'Create item';
  }

  async show(req: Request) {
    const id = req.param('id');
    return `Show item ${id}`;
  }

  async update(req: Request) {
    const id = req.param('id');
    return `Update item ${id}`;
  }

  async destroy(req: Request) {
    const id = req.param('id');
    return `Delete item ${id}`;
  }
}

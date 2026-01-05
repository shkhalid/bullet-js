import { Route, Request, throttle } from '@bulletjs/http';
import { View } from '@bulletjs/view';

Route.get('/', async (req: Request) => {
    return View.render('Home', {}, req);
});

Route.get('/login', async (req: Request) => {
    return View.render('Auth/Login', {}, req);
});

Route.get('/register', async (req: Request) => {
    return View.render('Auth/Register', {}, req);
});

// Throttled route example: 2 requests per minute
Route.get('/api/throttled', async () => {
    return { message: 'This is a throttled route. You can only see this twice a minute.' };
}).middleware(throttle(2, 1));

import { Route, Request } from '@bullet-js/http';
import { validate } from '@bullet-js/validation';

// Example: User registration with validation
Route.post('/api/register', async (req: Request) => {
    const data = await req.body();
    
    const validator = validate(data, {
        name: ['required', 'string', 'min:3'],
        email: ['required', 'email'],
        password: ['required', 'min:8', 'confirmed'],
        age: ['numeric', 'min:18']
    });
    
    await validator.validate();
    
    if (validator.fails()) {
        return Response.json({
            success: false,
            errors: validator.getErrors()
        }, { status: 422 });
    }
    
    // Process registration...
    return Response.json({
        success: true,
        message: 'User registered successfully'
    });
});

Route.get('/api/health', () => {
    return Response.json({ status: 'ok', timestamp: new Date() });
});

Route.get('/api/posts', async () => {
    return Response.json([
        { id: 1, title: 'API Post 1' },
        { id: 2, title: 'API Post 2' }
    ]);
});

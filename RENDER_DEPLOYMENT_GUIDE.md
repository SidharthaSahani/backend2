# Render Deployment Guide

## Environment Variables Setup

You need to add these environment variables in your Render dashboard:

### Database Configuration
```
MONGODB_URI=mongodb+srv://sidharthasahani:sidhartha00@tablebooking.cdcxwge.mongodb.net/restaurant_booking?retryWrites=true&w=majority&ssl=true
```

### Application Settings
```
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://grillsandgather.vercel.app
```

### Authentication
```
JWT_SECRET=177f1a032041041e6c1f906d458b1b05def27b50cf5d494da5b773e9bf5e41cdc9565fa4b583ce41fdd3e4ab4daf541bf1c3c91246ad367df052f3641039d5ff
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=apple@123
```

### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=deax3wraz
CLOUDINARY_API_KEY=943599374457876
CLOUDINARY_API_SECRET=Sd8X-Lbw-tMPA5Kvu3vYg_-TpTo
```

## How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Navigate to your service
3. Click on "Environment Variables" tab
4. Add each variable with the exact names and values above
5. Redeploy your application

## Verification Steps

After setting the variables:
1. Trigger a new deployment
2. Check logs for "✅ Cloudinary configured successfully"
3. Verify the Cloud Name is displayed correctly
4. Test image upload functionality

## Troubleshooting

If you still see the error:
- Double-check variable names (case-sensitive)
- Ensure no extra spaces in values
- Verify all required variables are present
- Check Render logs for specific missing variable names
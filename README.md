# WeCollab

WeCollab adds a security layer between video editors and YouTube channel owners, ensuring that editors do not have direct upload access to the owner's YouTube channel. Instead of granting full editor permissions on YouTube, WeCollab provides a controlled and secure way to share and manage video uploads.
## Features
- **No Need to Grant Direct Editor Access**: Share and upload videos securely without giving your editor full YouTube access.
- **Easy Video Sharing**: Upload videos directly through WeCollab without downloading and re-uploading.
- **Video-on-Demand Feature**: View your final video before uploading it to YouTube.
- **Manual Authentication**: Users log in using email and password.
- **YouTube OAuth Integration**: Uses NextAuth for obtaining upload permissions.
- **Secure Uploads**: Editors can upload videos without needing full YouTube account access.
- **Role-Based Access Control**: Ensures only authorized users can manage video uploads.

## Home Page
![image](https://github.com/user-attachments/assets/57d2ea5b-83a0-48fb-81e1-d66a8c25a105)
![image](https://github.com/user-attachments/assets/969f8635-67f8-4da4-8c0a-1ddbd935f19e)
## Owner
![image](https://github.com/user-attachments/assets/e4622568-90e4-4ad3-8076-2f5a59763c19)
## Editor
![image](https://github.com/user-attachments/assets/007aea02-520e-4ce1-888e-339f8261c456)




## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, NextAuth.js, Prisma (if using a database)
- **Database**: PostgreSQL / MongoDB (based on setup)
- **Authentication**: NextAuth.js for YouTube OAuth + manual email/password login
- **Storage**: Cloud storage for temporary video handling (if applicable)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/wecollab.git
   cd wecollab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (`.env` file):
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   DATABASE_URL=your-database-url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage
- **Login**: Users sign in manually using email and password.
- **Connect YouTube Account**: Users grant upload access via Google OAuth.
- **Upload Videos**: Editors can upload videos, which are securely processed and sent to the linked YouTube channel.

## Future Enhancements
- Video Communication within dashboard
- Multiple People/Roles in a dashboard 
- Improve UI/UX for seamless collaboration.

## Contributing
Pull requests are welcome. Please open an issue first for discussion before making changes.


# RealtorArena

RealtorArena is a full-featured real estate web platform built with React and Supabase. It includes property listings, user authentication with role-based access, an admin dashboard for managing listings, inquiries, users, and consultations, plus AI-powered features.

---

## 🚀 Features

- Responsive property listings with filtering and search  
- Secure user authentication with roles: admin, superadmin, agent, editor, viewer  
- Admin dashboard for managing properties, inquiries, users, and consultations  
- Integration with Supabase backend (PostgreSQL, auth, storage, row-level security)  
- Consultation and contact form handling  
- AI-powered enhancements (via OpenAI API)  
- Role-based access control enforced in UI and backend  
- Hosted on Vercel for fast global delivery  

---

## 🛠 Technology Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn-ui components  
- Backend: Supabase (PostgreSQL, Auth, Storage, RLS)  
- AI: OpenAI API integration  
- Hosting & Deployment: Vercel  

---

## 💻 Getting Started

### Prerequisites

- Node.js v18+  
- npm or yarn  
- Supabase project with API keys  
- OpenAI API key (optional for AI features)  

### Installation

```bash
git clone https://github.com/DP-Tech1324/realtorarena.git
cd realtorarena
npm install
## Environment Setup

Create a .env file in the root directory with:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key # optional


Run Locally
npm run dev

🚀 Deployment
	•	The project is deployed on Vercel.
	•	Set environment variables in Vercel dashboard as in .env.
	•	Build command: npm run build
	•	Output directory: dist


🔐 Authentication & Authorization
	•	User registration, login, and password reset.
	•	Roles supported: admin, superadmin, agent, editor, viewer.
	•	Role-based UI rendering and route protection.
	•	Supabase RLS policies ensure secure data access.
    
🤝 Contributing

We welcome contributions! Please:
	•	Fork the repo
	•	Create a feature branch (feature/xyz)
	•	Commit with clear messages
	•	Open a pull request

📄 License

This project is licensed under the MIT License. See the LICENSE file for details.


🙏 Acknowledgements

Built with React, Supabase, Tailwind CSS, and OpenAI API — inspired by modern real estate platforms.


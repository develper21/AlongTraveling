# Contributing to HopAlong

Thank you for your interest in contributing to HopAlong! This guide will help you get started with contributing to our travel companion platform.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- MongoDB (local or MongoDB Atlas)
- Git

### Setup Instructions

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub and clone your fork
   git clone https://github.com/your-username/HopAlong.git
   cd HopAlong
   ```

2. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend environment
   cd ../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Follow the existing code style and conventions
- Write clean, readable code
- Add comments for complex logic
- Ensure your code is properly tested

### 3. Test Your Changes

```bash
# Backend tests
cd backend
npm test
npm run lint

# Frontend tests
cd frontend
npm run lint
```

### 4. Commit Your Changes

Follow our commit message convention:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality

fix(trips): resolve date validation issue

docs(readme): update installation instructions
```

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 🧪 Testing Requirements

### Backend Testing

- **Unit Tests**: All new controllers, models, and utilities must have unit tests
- **Integration Tests**: API endpoints must have integration tests
- **Coverage**: Maintain minimum 80% test coverage
- **Test Commands**:
  ```bash
  npm test                    # Run all tests
  npm run test:watch         # Run tests in watch mode
  npm run test:coverage      # Run tests with coverage report
  ```

### Frontend Testing

- **Component Tests**: All new components must have tests
- **E2E Tests**: Critical user flows must have E2E tests
- **Linting**: Code must pass ESLint checks
- **Test Commands**:
  ```bash
  npm run lint               # Check code style
  npm run lint:fix          # Auto-fix linting issues
  npm run test              # Run tests (when implemented)
  ```

## 📝 Code Style Guide

### JavaScript/Node.js (Backend)

- Use ES6+ features
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Follow JSDoc commenting standards
- Keep functions small and focused

### React/JavaScript (Frontend)

- Use functional components with hooks
- Follow React naming conventions
- Use PropTypes or TypeScript for type checking
- Keep components small and reusable
- Use TailwindCSS for styling

### General Guidelines

- Write descriptive variable and function names
- Keep functions under 50 lines when possible
- Use meaningful comments
- Follow DRY (Don't Repeat Yourself) principle
- Write self-documenting code

## 🏗️ Project Structure

```
HopAlong/
├── backend/                 # Node.js/Express API
│   ├── controllers/         # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── tests/              # Test files
│   └── server.js           # Server entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── routes/         # Page components
│   │   ├── api/           # API client
│   │   ├── store/         # State management
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
└── docs/                  # Documentation
```

## 🔄 Feature Development Process

### 1. Planning Phase

- Create an issue describing the feature/bug
- Discuss implementation approach
- Break down into smaller tasks
- Estimate effort and timeline

### 2. Development Phase

- Set up development environment
- Implement feature incrementally
- Test each component thoroughly
- Update documentation

### 3. Review Phase

- Self-review your code
- Ensure all tests pass
- Check code coverage
- Update README if needed

### 4. Deployment Phase

- Code must pass all CI/CD checks
- Feature must be tested in staging
- Documentation must be updated
- Deploy to production after approval

## 🐛 Bug Reporting

### How to Report a Bug

1. **Check existing issues** - Search for duplicate reports
2. **Use the bug report template** - Provide all required information
3. **Include reproduction steps** - Detailed steps to reproduce the issue
4. **Add screenshots/videos** - Visual evidence of the bug
5. **Provide environment details** - OS, browser, version numbers

### Bug Report Template

```markdown
**Bug Description**
Brief description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
Add screenshots if applicable

**Environment**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96.0, Firefox 95.0]
- Version: [e.g. v1.2.3]
```

## 💡 Feature Requests

### How to Request a Feature

1. **Check existing issues** - Search for duplicate requests
2. **Use the feature request template** - Provide detailed information
3. **Explain the use case** - Why this feature is needed
4. **Consider implementation** - Technical feasibility

### Feature Request Template

```markdown
**Feature Description**
Brief description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've thought of

**Additional Context**
Any other relevant information
```

## 📧 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Email**: [your-email@example.com] for private inquiries

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor highlights

Thank you for contributing to HopAlong! 🎉

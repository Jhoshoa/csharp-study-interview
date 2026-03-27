# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Senior .NET Backend Engineer Study Guide** - a documentation-focused repository combining:
- **Docusaurus site**: Interactive documentation for C# and .NET interview preparation
- **.NET projects**: Practice code examples in `projects/`

## Common Commands

### Documentation Site (Docusaurus)
```bash
npm install          # Install dependencies
npm start            # Start dev server at localhost:3000
npm run build        # Production build to /build
npm run serve        # Serve production build locally
```

### .NET Projects
```bash
# Build entire solution
dotnet build C#-study-interview.sln

# Run specific project
dotnet run --project projects/01-BasicConsoleApps/CSharpPractice/CSharpPractice.csproj
dotnet run --project projects/02-WebAPI-Projects/SampleWebAPI/SampleWebAPI.csproj
```

## Repository Structure

```
├── docs/                    # Markdown documentation (Docusaurus content)
│   ├── 01-csharp-fundamentals/
│   ├── 02-csharp-advanced/
│   ├── ...
│   └── 16-interview-questions/
├── projects/                # .NET practice projects
│   ├── 01-BasicConsoleApps/
│   ├── 02-WebAPI-Projects/
│   ├── 03-DesignPatterns-Practice/
│   ├── 04-Testing-Practice/
│   └── 05-FullStack-Projects/
├── src/                     # Docusaurus React components/CSS
├── static/                  # Static assets for docs site
├── docusaurus.config.ts     # Docusaurus configuration
├── sidebars.ts              # Documentation sidebar structure
└── C#-study-interview.sln   # Visual Studio solution
```

## Technical Details

- **Target Framework**: .NET 8.0
- **Docusaurus Version**: 3.7+
- **Node.js Requirement**: >=18.0
- Documentation supports PlantUML diagrams via `@akebifiky/remark-simple-plantuml`

## Documentation Conventions

- Documentation lives in `docs/` with numbered folders (01-16) corresponding to topics
- Each topic folder has a `README.md` overview and numbered subtopic files
- Topics follow the study progression: fundamentals -> advanced -> frameworks -> professional skills

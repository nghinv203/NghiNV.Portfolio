import { Skill } from '@models/index';

export const SKILLS: Skill[] = [
  // Languages
  { id: 'csharp', name: 'C#', category: 'language', level: 5, featured: true },
  { id: 'ts', name: 'TypeScript', category: 'language', level: 4, featured: true },
  { id: 'js', name: 'JavaScript', category: 'language', level: 4, featured: false },
  { id: 'go', name: 'Golang', category: 'language', level: 3, featured: true },
  { id: 'sql', name: 'SQL', category: 'language', level: 4, featured: false },
  { id: 'java', name: 'Java', category: 'language', level: 2, featured: false },

  // Frameworks
  { id: 'dotnet', name: '.NET / ASP.NET', category: 'framework', level: 5, featured: true },
  { id: 'angular', name: 'Angular', category: 'framework', level: 4, featured: true },
  { id: 'vue', name: 'Vue.js 2', category: 'framework', level: 4, featured: true },
  { id: 'efcore', name: 'EF Core', category: 'framework', level: 4, featured: false },
  { id: 'gin', name: 'Gin', category: 'framework', level: 3, featured: false },

  // Tooling
  { id: 'git', name: 'Git', category: 'tooling', level: 4, featured: false },
  { id: 'docker', name: 'Docker', category: 'tooling', level: 3, featured: false },
  { id: 'signalr', name: 'SignalR', category: 'tooling', level: 4, featured: false },
  { id: 'redis', name: 'Redis', category: 'tooling', level: 3, featured: false },
  { id: 'rabbitmq', name: 'RabbitMQ', category: 'tooling', level: 3, featured: false },
  { id: 'elastic', name: 'Elasticsearch', category: 'tooling', level: 3, featured: false },

  // Platforms / databases
  { id: 'sqlserver', name: 'SQL Server', category: 'platform', level: 4, featured: false },
  { id: 'postgres', name: 'PostgreSQL', category: 'platform', level: 4, featured: false },
  { id: 'aws', name: 'AWS (S3)', category: 'platform', level: 3, featured: false },

  // Practices
  { id: 'clean-arch', name: 'Clean Architecture', category: 'soft', level: 4, featured: false },
  { id: 'solid', name: 'SOLID Principles', category: 'soft', level: 4, featured: false },
];

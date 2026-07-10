import { Certificate, Education } from '@models/index';

export const CERTIFICATES: Certificate[] = [
  {
    id: 'c-csharp',
    name: 'Foundational C# with Microsoft',
    issuer: 'Microsoft / freeCodeCamp',
    issuedDate: '2024-01',
  },
  {
    id: 'c-sdlc',
    name: 'Software Development Lifecycle',
    issuer: 'University of Minnesota (Coursera)',
    issuedDate: '2023-08',
  },
  {
    id: 'c-webdesign',
    name: 'Web Design for Everybody: Basics of Web Development & Coding',
    issuer: 'University of Michigan (Coursera)',
    issuedDate: '2023-05',
  },
];

export const EDUCATION: Education[] = [
  {
    id: 'e-fpt',
    school: 'FPT University',
    degree: {
      en: 'Bachelor',
      vi: 'Cử nhân',
      ja: '学士',
    },
    field: {
      en: 'Software Engineering',
      vi: 'Kỹ thuật Phần mềm',
      ja: 'ソフトウェア工学',
    },
    startYear: 2021,
    endYear: 2025,
  },
];

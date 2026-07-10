import { Profile } from '@models/index';

export const PROFILE: Profile = {
  fullName: 'Nguyen Van Nghi',
  title: {
    en: 'Software Developer',
    vi: 'Lập trình viên phần mềm',
    ja: 'ソフトウェア開発者',
  },
  avatarUrl: '/images/avatar.svg',
  bio: {
    en: 'Early-career software developer with ~1.5 years of professional experience building enterprise web applications with .NET, Angular and Vue, plus hands-on work in Golang. I enjoy backend APIs, asynchronous processing and reusable frontend components, and I apply clean architecture and SOLID principles in real projects. Eager to keep growing in backend development, performance optimization and system design.',
    vi: 'Lập trình viên phần mềm giai đoạn đầu sự nghiệp với khoảng 1.5 năm kinh nghiệm xây dựng các ứng dụng web doanh nghiệp bằng .NET, Angular và Vue, cùng kinh nghiệm thực tế với Golang. Tôi yêu thích backend API, xử lý bất đồng bộ và các component frontend tái sử dụng, đồng thời áp dụng clean architecture và nguyên lý SOLID trong dự án thực tế. Mong muốn tiếp tục phát triển về backend, tối ưu hiệu năng và thiết kế hệ thống.',
    ja: 'キャリア初期のソフトウェア開発者で、.NET・Angular・Vue を用いたエンタープライズ Web アプリ開発を約1.5年経験し、Golang の実務経験もあります。バックエンド API、非同期処理、再利用可能なフロントエンドコンポーネントが得意で、実プロジェクトでクリーンアーキテクチャと SOLID 原則を実践しています。バックエンド開発・パフォーマンス最適化・システム設計をさらに深めたいと考えています。',
  },
  location: 'Hanoi, Vietnam',
  yearsOfExperience: 1.5,
  resumeUrl: '/files/Nguyen_Van_Nghi_Software_Developer_CV.pdf',
  socials: [
    { platform: 'github', url: 'https://github.com/nghinv203', icon: 'github' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/nghinv', icon: 'linkedin' },
    { platform: 'email', url: 'mailto:vannghibg03@gmail.com', icon: 'mail' },
  ],
  contact: {
    email: 'vannghibg03@gmail.com',
    phone: '+84 364 920 299',
    location: 'Hanoi, Vietnam',
    availableForWork: true,
  },
};

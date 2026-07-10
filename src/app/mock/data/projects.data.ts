import { ProjectDetail } from '@models/index';

/**
 * Detail records are the source of truth; the list endpoint returns a
 * projection of these (see mock-backend). Keeps mock data in one place.
 */
export const PROJECTS: ProjectDetail[] = [
  {
    id: 'p-fu-judge',
    slug: 'fu-judge',
    title: 'FU Judge',
    summary: {
      en: 'A competitive programming platform with contests, automated judging and real-time leaderboards.',
      vi: 'Nền tảng lập trình thi đấu với các cuộc thi, chấm bài tự động và bảng xếp hạng thời gian thực.',
      ja: 'コンテスト・自動採点・リアルタイムランキングを備えた競技プログラミングプラットフォーム。',
    },
    thumbnailUrl: '/images/projects/fu-judge.svg',
    techStack: ['ASP.NET Core', 'PostgreSQL', 'Angular', 'Docker', 'AWS', 'Git'],
    featured: true,
    links: {
      repo: 'https://gitlab.com/sep4902321029/pulse-api',
    },
    year: 2025,
    description: {
      en: 'My graduation project: a full competitive programming platform supporting contests, automated judging and real-time leaderboards.',
      vi: 'Đồ án tốt nghiệp của tôi: nền tảng lập trình thi đấu hoàn chỉnh hỗ trợ các cuộc thi, chấm bài tự động và bảng xếp hạng thời gian thực.',
      ja: '私の卒業制作：コンテスト・自動採点・リアルタイムランキングに対応した本格的な競技プログラミングプラットフォーム。',
    },
    gallery: ['/images/projects/fu-judge.svg'],
    role: {
      en: 'Full-stack developer (graduation project)',
      vi: 'Lập trình viên full-stack (đồ án tốt nghiệp)',
      ja: 'フルスタック開発者（卒業制作）',
    },
    problem: {
      en: 'Running programming contests requires reliable automated judging and instant feedback without blocking users while submissions are evaluated.',
      vi: 'Tổ chức các cuộc thi lập trình cần chấm bài tự động đáng tin cậy và phản hồi tức thì mà không chặn người dùng trong lúc đánh giá bài nộp.',
      ja: 'プログラミングコンテストの運営には、提出物の評価中にユーザーをブロックせず、信頼性の高い自動採点と即時フィードバックが必要。',
    },
    solution: {
      en: 'Designed the backend with Clean Architecture and used asynchronous judging to run evaluations in the background, with real-time result updates pushed to the leaderboard. The frontend follows a feature-based structure.',
      vi: 'Thiết kế backend theo Clean Architecture và dùng chấm bài bất đồng bộ để chạy đánh giá ở nền, cập nhật kết quả thời gian thực lên bảng xếp hạng. Frontend theo cấu trúc feature-based.',
      ja: 'バックエンドをクリーンアーキテクチャで設計し、非同期採点で評価をバックグラウンド実行、結果をリアルタイムでランキングに反映。フロントエンドは機能ベース構成。',
    },
  },
  {
    id: 'p-ezcloud-hotel',
    slug: 'ezcloud-hotel',
    title: 'ezCloud Hotel Management',
    summary: {
      en: 'A comprehensive hotel management platform with real-time dual-screen invoicing over SignalR.',
      vi: 'Nền tảng quản lý khách sạn toàn diện với màn hình đôi hóa đơn thời gian thực qua SignalR.',
      ja: 'SignalR によるリアルタイムのデュアルスクリーン請求機能を備えた総合ホテル管理プラットフォーム。',
    },
    thumbnailUrl: '/images/projects/ezcloud-hotel.svg',
    techStack: ['Vue.js 2', 'ASP.NET Framework', 'SignalR', 'Redis', 'RabbitMQ', 'SQL Server'],
    featured: true,
    links: {},
    year: 2025,
    description: {
      en: 'A management solution for 3–5 star hotels covering restaurant, bar, golf course and room-by-room power management, where I contributed reporting, reservation restoration and real-time features.',
      vi: 'Giải pháp quản lý cho khách sạn 3–5 sao gồm nhà hàng, bar, sân golf và quản lý điện từng phòng, nơi tôi đóng góp các tính năng báo cáo, khôi phục đặt phòng và thời gian thực.',
      ja: 'レストラン・バー・ゴルフ場・客室ごとの電力管理を含む3〜5つ星ホテル向け管理ソリューション。レポート、予約復元、リアルタイム機能を担当。',
    },
    gallery: ['/images/projects/ezcloud-hotel.svg'],
    role: {
      en: 'Full-stack developer',
      vi: 'Lập trình viên full-stack',
      ja: 'フルスタック開発者',
    },
    solution: {
      en: 'Built a real-time dual-screen experience with SignalR and used background processing (Redis, RabbitMQ) for non-blocking security and reporting workflows.',
      vi: 'Xây dựng trải nghiệm màn hình đôi thời gian thực với SignalR và dùng xử lý nền (Redis, RabbitMQ) cho luồng bảo mật và báo cáo không chặn.',
      ja: 'SignalR でリアルタイムのデュアルスクリーン体験を構築し、バックグラウンド処理（Redis・RabbitMQ）でノンブロッキングのセキュリティ・レポート処理を実現。',
    },
  },
  {
    id: 'p-cyber-intel',
    slug: 'cyber-threat-intel',
    title: 'Cyber Threat Intelligence Platform',
    summary: {
      en: 'A cybersecurity intelligence platform for early risk detection and CVE analysis.',
      vi: 'Nền tảng thông tin an ninh mạng để phát hiện rủi ro sớm và phân tích CVE.',
      ja: '早期リスク検知と CVE 分析のためのサイバーセキュリティインテリジェンスプラットフォーム。',
    },
    thumbnailUrl: '/images/projects/cyber-threat-intel.svg',
    techStack: ['Golang', 'Angular 12', 'Elasticsearch', 'PrimeNG', 'Angular Material'],
    featured: false,
    links: {},
    year: 2025,
    description: {
      en: 'A platform enabling early risk detection and proactive defense, where I built reusable UI components and CVE data pipelines handling large Excel imports.',
      vi: 'Nền tảng giúp phát hiện rủi ro sớm và phòng thủ chủ động, nơi tôi xây dựng các component UI tái sử dụng và pipeline dữ liệu CVE xử lý import Excel lớn.',
      ja: '早期リスク検知とプロアクティブ防御を実現するプラットフォーム。再利用可能な UI コンポーネントと大規模 Excel インポートを扱う CVE データパイプラインを構築。',
    },
    gallery: ['/images/projects/cyber-threat-intel.svg'],
    role: {
      en: 'Software engineer intern',
      vi: 'Thực tập sinh kỹ sư phần mềm',
      ja: 'ソフトウェアエンジニアインターン',
    },
    solution: {
      en: 'Implemented chunked Excel import for up to 25,000 CVE records and a reusable, configurable table plus type-ahead search components.',
      vi: 'Triển khai import Excel theo khối cho tới 25.000 bản ghi CVE cùng component bảng cấu hình được và tìm kiếm type-ahead tái sử dụng.',
      ja: '最大25,000件の CVE レコード向けチャンク分割 Excel インポートと、設定可能な再利用テーブル・タイプアヘッド検索コンポーネントを実装。',
    },
  },
];

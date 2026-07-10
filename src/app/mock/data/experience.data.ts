import { Experience } from '@models/index';

export const EXPERIENCE: Experience[] = [
  {
    id: 'exp-ezcloud',
    company: 'ezCloud Technologies Pte Ltd',
    role: {
      en: 'Full-stack Developer',
      vi: 'Lập trình viên Full-stack',
      ja: 'フルスタック開発者',
    },
    startDate: '2025-11',
    endDate: null,
    location: 'Hanoi, Vietnam',
    summary: {
      en: 'Comprehensive management solution for 3–5 star hotels and guesthouses, with modules for restaurant, bar, golf course and room-by-room power management. Team of 12.',
      vi: 'Giải pháp quản lý toàn diện cho khách sạn 3–5 sao và nhà nghỉ, gồm các module nhà hàng, bar, sân golf và quản lý điện từng phòng. Đội ngũ 12 người.',
      ja: '3〜5つ星ホテルとゲストハウス向けの総合管理ソリューション。レストラン・バー・ゴルフ場・客室ごとの電力管理モジュールを備える。チーム12名。',
    },
    highlights: [
      {
        en: 'Delivered a new accommodation declaration reporting feature within one week, ensuring compliance with updated government regulations.',
        vi: 'Hoàn thành tính năng báo cáo khai báo lưu trú mới trong một tuần, đảm bảo tuân thủ quy định mới của nhà nước.',
        ja: '新しい宿泊申告レポート機能を1週間で提供し、更新された政府規制への準拠を実現。',
      },
      {
        en: 'Developed a reservation restoration feature for No-show and Cancelled bookings, letting hotels recover reservations while preserving reporting accuracy.',
        vi: 'Phát triển tính năng khôi phục đặt phòng cho các booking No-show và Cancelled, giúp khách sạn phục hồi đặt phòng mà vẫn giữ độ chính xác báo cáo.',
        ja: 'No-show・キャンセル予約の復元機能を開発し、レポートの正確性を保ちながら予約を復旧可能に。',
      },
      {
        en: 'Improved account security with asynchronous session invalidation via third-party API, using background processing to avoid blocking the main workflow.',
        vi: 'Nâng cao bảo mật tài khoản bằng cách vô hiệu hóa phiên bất đồng bộ qua API bên thứ ba, dùng xử lý nền để không chặn luồng chính.',
        ja: 'サードパーティ API による非同期セッション無効化でアカウントセキュリティを強化し、バックグラウンド処理でメインフローのブロッキングを回避。',
      },
      {
        en: 'Built a real-time dual-screen solution with SignalR, letting hotel staff and guests interact with invoice and QR information simultaneously.',
        vi: 'Xây dựng giải pháp màn hình đôi thời gian thực với SignalR, cho phép nhân viên và khách tương tác đồng thời với thông tin hóa đơn và QR.',
        ja: 'SignalR でリアルタイムのデュアルスクリーンソリューションを構築し、スタッフとゲストが請求書と QR 情報を同時に操作可能に。',
      },
    ],
    techStack: [
      'Vue.js 2',
      'ASP.NET Framework',
      'Redis',
      'RabbitMQ',
      'SQL Server',
      'Aspose Cells',
      'Kendo UI',
      'SignalR',
    ],
    companyUrl: 'https://ezcloud.vn',
  },
  {
    id: 'exp-viettel',
    company: 'Viettel Software',
    role: {
      en: 'Software Engineer Intern',
      vi: 'Thực tập sinh Kỹ sư Phần mềm',
      ja: 'ソフトウェアエンジニアインターン',
    },
    startDate: '2025-01',
    endDate: '2025-10',
    location: 'Hanoi, Vietnam',
    summary: {
      en: 'A cybersecurity intelligence platform enabling early risk detection, enhanced visibility and proactive defense. Team of 15.',
      vi: 'Nền tảng thông tin an ninh mạng giúp phát hiện rủi ro sớm, tăng khả năng giám sát và phòng thủ chủ động. Đội ngũ 15 người.',
      ja: '早期リスク検知・可視性向上・プロアクティブ防御を実現するサイバーセキュリティインテリジェンスプラットフォーム。チーム15名。',
    },
    highlights: [
      {
        en: 'Built a reusable table component with configurable columns, formatters and custom styling, improving frontend efficiency and consistency.',
        vi: 'Xây dựng component bảng tái sử dụng với cột cấu hình được, bộ định dạng và style tùy chỉnh, cải thiện hiệu quả và tính nhất quán của frontend.',
        ja: '設定可能な列・フォーマッター・カスタムスタイルを備えた再利用可能なテーブルコンポーネントを構築し、フロントエンドの効率と一貫性を向上。',
      },
      {
        en: 'Developed Excel import for CVE data supporting up to 25,000 records using chunked upload processing.',
        vi: 'Phát triển tính năng import Excel cho dữ liệu CVE hỗ trợ tới 25.000 bản ghi bằng xử lý upload theo khối.',
        ja: 'チャンク分割アップロードで最大25,000件の CVE データに対応した Excel インポートを開発。',
      },
      {
        en: 'Built CVE and vulnerability analysis features assessing severity and providing actionable remediation insights.',
        vi: 'Xây dựng tính năng phân tích CVE và lỗ hổng, đánh giá mức độ nghiêm trọng và đưa ra hướng khắc phục khả thi.',
        ja: '深刻度を評価し実行可能な修復インサイトを提供する CVE・脆弱性分析機能を構築。',
      },
      {
        en: 'Created a reusable Common Search component with lazy-loaded type-ahead suggestions for external data fetching.',
        vi: 'Tạo component Common Search tái sử dụng với gợi ý type-ahead tải lười để lấy dữ liệu bên ngoài.',
        ja: '外部データ取得向けに遅延読み込みのタイプアヘッド候補を備えた再利用可能な共通検索コンポーネントを作成。',
      },
    ],
    techStack: ['Golang (Gin, Echo)', 'Angular 12', 'Elasticsearch', 'PrimeNG', 'Angular Material', 'NG-ZORRO'],
  },
  {
    id: 'exp-fpt',
    company: 'FPT Software',
    role: {
      en: 'Full-stack Developer (OJT)',
      vi: 'Lập trình viên Full-stack (OJT)',
      ja: 'フルスタック開発者（OJT）',
    },
    startDate: '2024-09',
    endDate: '2024-12',
    location: 'Hanoi, Vietnam',
    summary: {
      en: 'A structured On-the-Job Training program following a development roadmap toward a full-stack .NET and Angular role.',
      vi: 'Chương trình đào tạo thực tế (OJT) có lộ trình phát triển hướng tới vai trò full-stack .NET và Angular.',
      ja: 'フルスタック（.NET・Angular）の役割に向けた開発ロードマップに沿った体系的な OJT プログラム。',
    },
    highlights: [
      {
        en: 'Developed and maintained web features using ASP.NET Core, Angular and Entity Framework Core.',
        vi: 'Phát triển và duy trì các tính năng web với ASP.NET Core, Angular và Entity Framework Core.',
        ja: 'ASP.NET Core・Angular・Entity Framework Core を用いて Web 機能を開発・保守。',
      },
      {
        en: 'Applied Clean Architecture and a feature-based frontend structure to improve maintainability and reusability.',
        vi: 'Áp dụng Clean Architecture và cấu trúc frontend theo feature để tăng khả năng bảo trì và tái sử dụng.',
        ja: 'クリーンアーキテクチャと機能ベースのフロントエンド構成を適用し、保守性と再利用性を向上。',
      },
      {
        en: 'Used AWS S3 for file storage and followed SOLID principles and team coding standards.',
        vi: 'Sử dụng AWS S3 để lưu trữ file và tuân thủ nguyên lý SOLID cùng chuẩn code của nhóm.',
        ja: 'ファイル保存に AWS S3 を使用し、SOLID 原則とチームのコーディング規約に準拠。',
      },
    ],
    techStack: ['ASP.NET Core', 'Angular', 'SQL Server', 'NG-ZORRO', 'AWS S3'],
    companyUrl: 'https://fptsoftware.com',
  },
];

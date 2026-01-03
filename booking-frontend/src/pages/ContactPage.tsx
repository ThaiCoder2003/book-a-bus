import UserHeader from '@/components/helpers/UserHeader'
import { Mail, Phone } from 'lucide-react'

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <style>{`
        :root {
          --background: #fafaf9;
          --foreground: #262626;
          --card: #ffffff;
          --card-foreground: #262626;
          --primary: #2563eb;
          --primary-light: #3b82f6;
          --primary-foreground: #fafaf9;
          --muted-foreground: #737373;
          --border: #e7e5e4;
          --accent: #0ea5e9;
        }

        body {
          background-color: var(--background);
          color: var(--foreground);
        }

        .contact-header {
          border-bottom: 1px solid var(--border);
        }

        .group-info-section {
          background-color: rgba(37, 99, 235, 0.05);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 8px;
          padding: 40px;
        }

        .member-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .member-card:hover {
          border-color: var(--primary-light);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .contact-link {
          color: var(--primary);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .contact-link:hover {
          text-decoration: underline;
          opacity: 0.8;
        }
      `}</style>
            <UserHeader />

            {/* Header */}
            <header className="contact-header">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                        Liên hệ nhóm
                    </h1>
                    <p className="text-lg text-slate-600">
                        Thông tin và chi tiết liên hệ nhóm dự án
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Group Info Section */}
                <section className="mb-16">
                    <div className="group-info-section">
                        <h2
                            className="text-3xl font-bold mb-8"
                            style={{ color: 'var(--primary)' }}
                        >
                            Thông tin nhóm
                        </h2>

                        <div className="grid sm:grid-cols-3 gap-8">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Tên nhóm
                                </p>
                                <p className="text-2xl font-bold">Nhóm 01</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Lớp
                                </p>
                                <p className="text-2xl font-bold">22KTPM3</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Môn học
                                </p>
                                <p className="text-2xl font-bold">
                                    Lập trình ứng dụng Web nâng cao
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Members Section */}
                <section>
                    <h2 className="text-3xl font-bold mb-8">Thành viên nhóm</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Member 1 */}
                        <div className="member-card">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1">
                                    Hoàng Văn Khải
                                </h3>
                                <p className="text-sm text-slate-600 font-medium">
                                    MSSV: 22127173
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: 'var(--primary)' }}
                                    />
                                    <a
                                        href="mailto:hvkhai22@clc.fitus.edu.vn"
                                        className="contact-link text-sm break-all"
                                    >
                                        hvkhai22@clc.fitus.edu.vn
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: 'var(--primary)' }}
                                    />
                                    <a
                                        href="tel:+8499187513"
                                        className="contact-link text-sm"
                                    >
                                        0399 187 513
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Member 2 */}
                        <div className="member-card">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1">
                                    Lê Phan Thanh Nhân
                                </h3>
                                <p className="text-sm text-slate-600 font-medium">
                                    MSSV: 21127655
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: 'var(--primary)' }}
                                    />
                                    <a
                                        href="mailto:lptnhan21@clc.fitus.edu.vn"
                                        className="contact-link text-sm break-all"
                                    >
                                        lptnhan21@clc.fitus.edu.vn
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: 'var(--primary)' }}
                                    />
                                    <a
                                        href="tel:+84878865174"
                                        className="contact-link text-sm"
                                    >
                                        0878 865 174
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Member 3 */}
                        <div className="member-card">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1">
                                    Đặng Quốc Thái
                                </h3>
                                <p className="text-sm text-slate-600 font-medium">
                                    MSSV: 21127545
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: 'var(--primary)' }}
                                    />
                                    <a
                                        href="mailto:dqthai21@clc.fitus.edu.vn"
                                        className="contact-link text-sm break-all"
                                    >
                                        dqthai21@clc.fitus.edu.vn
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone
                                        className="w-4 h-4 shrink-0"
                                        style={{ color: 'var(--primary)' }}
                                    />
                                    <a
                                        href="tel:+84901234567"
                                        className="contact-link text-sm"
                                    >
                                        0901 234 567
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { LinkButton } from '@/components/ui/link-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  FileText,
  Play,
  Share2,
  Trophy,
  BarChart3,
  UserPlus,
  Upload,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Ngân hàng câu hỏi',
    description: 'Tạo và quản lý kho câu hỏi. Hỗ trợ import Excel, CSV, JSON.',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: FileText,
    title: 'Tạo đề thi',
    description: 'Thiết kế đề thi với thời gian, số câu tuỳ chỉnh.',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: Play,
    title: 'Ôn tập thông minh',
    description: 'Luyện tập ngẫu nhiên, xem đáp án ngay sau mỗi câu.',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: Share2,
    title: 'Chia sẻ đề thi',
    description: 'Chia sẻ qua link. Không cần đăng nhập để làm bài.',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    icon: Trophy,
    title: 'Bảng xếp hạng',
    description: 'Theo dõi thứ hạng và so sánh với người khác.',
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    icon: BarChart3,
    title: 'Thống kê chi tiết',
    description: 'Điểm số, tỷ lệ đúng sai, tiến trình theo thời gian.',
    color: 'text-indigo-600 bg-indigo-100',
  },
];

const steps = [
  {
    icon: UserPlus,
    title: 'Đăng ký tài khoản',
    description: 'Miễn phí với email hoặc Google.',
  },
  {
    icon: Upload,
    title: 'Thêm câu hỏi',
    description: 'Nhập thủ công hoặc từ file có sẵn.',
  },
  {
    icon: ClipboardList,
    title: 'Ôn tập & thi',
    description: 'Tạo đề thi hoặc ôn tập ngay.',
  },
  {
    icon: TrendingUp,
    title: 'Theo dõi tiến trình',
    description: 'Xem thống kê và chia sẻ.',
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();

  const isLoggedIn = !loading && !!user;

  return (
    <div className="min-h-screen flex flex-col">
      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 2s infinite; }
        .animate-float-slow { animation: float 8s ease-in-out 1s infinite; }
        .animate-float-fast { animation: float 5s ease-in-out 3s infinite; }
      `}</style>

      {/* Nav Bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Quiz App</span>
          </div>
          <div
            className="flex items-center gap-3 transition-opacity duration-300"
            style={{ opacity: loading ? 0 : 1 }}
          >
            {isLoggedIn ? (
              <LinkButton href="/dashboard">
                Vào ứng dụng <ArrowRight className="ml-1 h-4 w-4" />
              </LinkButton>
            ) : (
              <>
                <LinkButton href="/login" variant="ghost">
                  Đăng nhập
                </LinkButton>
                <LinkButton href="/register">Đăng ký miễn phí</LinkButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 px-4 py-24 text-white sm:py-32 lg:py-40">
        {/* Decorative floating icons */}
        <BookOpen className="animate-float absolute left-[10%] top-[15%] h-10 w-10 text-white/10 sm:h-14 sm:w-14" />
        <FileText className="animate-float-delayed absolute right-[15%] top-[20%] h-8 w-8 text-white/10 sm:h-12 sm:w-12" />
        <Trophy className="animate-float-slow absolute bottom-[20%] left-[20%] h-8 w-8 text-white/10 sm:h-12 sm:w-12" />
        <BarChart3 className="animate-float-fast absolute bottom-[25%] right-[10%] h-10 w-10 text-white/10 sm:h-14 sm:w-14" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Ôn tập và thi trắc nghiệm thông minh
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            Tạo ngân hàng câu hỏi, thiết kế đề thi, luyện tập và chia sẻ — tất cả trong một ứng dụng.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {isLoggedIn ? (
              <LinkButton
                href="/dashboard"
                className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-purple-700 hover:bg-white/90"
              >
                Vào ứng dụng <ArrowRight className="ml-2 h-5 w-5" />
              </LinkButton>
            ) : (
              <LinkButton
                href="/register"
                className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-purple-700 hover:bg-white/90"
              >
                Bắt đầu miễn phí <ArrowRight className="ml-2 h-5 w-5" />
              </LinkButton>
            )}
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex h-12 items-center rounded-xl border border-white/30 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Mọi thứ bạn cần để học tập hiệu quả
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition-shadow hover:shadow-lg"
              >
                <CardContent className="flex flex-col gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Bắt đầu chỉ với 4 bước
            </h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <Badge className="mb-4 h-8 w-8 items-center justify-center rounded-full text-sm">
                  {index + 1}
                </Badge>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 px-4 py-20 text-center text-white sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Sẵn sàng nâng cao kết quả học tập?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Hoàn toàn miễn phí. Bắt đầu ngay hôm nay.
          </p>
          <div className="mt-8">
            {isLoggedIn ? (
              <LinkButton
                href="/dashboard"
                className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-purple-700 hover:bg-white/90"
              >
                Vào ứng dụng <ArrowRight className="ml-2 h-5 w-5" />
              </LinkButton>
            ) : (
              <LinkButton
                href="/register"
                className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-purple-700 hover:bg-white/90"
              >
                Bắt đầu miễn phí <ArrowRight className="ml-2 h-5 w-5" />
              </LinkButton>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
        © 2024 Quiz App. Xây dựng để học tập hiệu quả hơn.
      </footer>
    </div>
  );
}

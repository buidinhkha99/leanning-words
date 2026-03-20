# Quiz App - Tài liệu dự án

## Tổng quan

Quiz App là nền tảng học tập và ôn thi trắc nghiệm trực tuyến, hỗ trợ người dùng tạo câu hỏi, tổ chức đề thi, luyện tập và theo dõi tiến độ học tập. Ứng dụng được xây dựng với giao diện tiếng Việt, hướng đến học sinh, sinh viên và giáo viên Việt Nam.

**URL:** https://quiz-app-chi-ruddy-36.vercel.app

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend Framework | Next.js 16 (React 19) |
| Ngôn ngữ | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Base UI) |
| Icons | Lucide React |
| Charts | Recharts |
| Authentication | Firebase Authentication (Email + Google) |
| Database | Cloud Firestore |
| Deployment | Vercel |
| Testing | Vitest + Playwright |
| File Import | xlsx, papaparse |

---

## Kiến trúc hệ thống

```
+------------------+       +-------------------+       +------------------+
|                  |       |                   |       |                  |
|   Vercel CDN     |<----->|   Next.js App     |<----->|   Firebase       |
|   (Hosting)      |       |   (Frontend)      |       |   - Auth         |
|                  |       |                   |       |   - Firestore    |
+------------------+       +-------------------+       +------------------+
```

### Kiến trúc Frontend (App Router)

```
src/
  app/
    (auth)/              # Các trang không cần đăng nhập
      login/             # Đăng nhập
      register/          # Đăng ký
    (main)/              # Các trang cần đăng nhập (có Header + Nav)
      dashboard/         # Trang chủ - tổng quan
      questions/         # Quản lý ngân hàng câu hỏi
      exams/             # Quản lý đề thi
      practice/          # Chế độ ôn tập
      quiz/[id]/         # Làm bài thi có tính giờ
      history/           # Lịch sử làm bài
      stats/             # Thống kê chi tiết
    share/[shareCode]/   # Trang công khai (không cần đăng nhập)
      take/              # Làm bài chia sẻ
      leaderboard/       # Bảng xếp hạng

  components/
    ui/                  # Component cơ bản (Button, Card, Dialog...)
    layout/              # Header, MobileNav, ExamTimer
    quiz/                # QuestionCard, OptionButton, ResultScore...
    import/              # FileUploader, ImportPreview
    stats/               # ScoreChart, AccuracyPieChart, LeaderboardTable
    shared/              # ConfirmDialog, EmptyState, PageTitle

  lib/
    firebase/            # Cấu hình Firebase, Auth, Collections
    services/            # Logic nghiệp vụ (CRUD, import, leaderboard)
    hooks/               # Custom hooks (useExamSession, useTimer...)
    contexts/            # AuthContext
    types/               # TypeScript type definitions
    utils/               # Helper functions, validators, constants
```

---

## Cấu trúc dữ liệu (Firestore)

```
users/{userId}/
  +-- questions/{questionId}       # Câu hỏi của người dùng
  +-- exams/{examId}               # Đề thi của người dùng
  +-- practiceHistory/{historyId}  # Lịch sử ôn tập
  +-- examHistory/{historyId}      # Lịch sử thi

sharedExams/{shareCode}/           # Đề thi chia sẻ công khai
  +-- attempts/{attemptId}         # Bài làm của người tham gia
```

### Mô hình dữ liệu chính

| Entity | Trường chính |
|---|---|
| Question | text, answers[], correctIndex |
| Exam | title, description, questionIds[], duration, shareCode |
| PracticeHistory | questions[], selectedAnswers[], score, total |
| ExamHistory | examId, examTitle, questions[], selectedAnswers[], score, total, duration, timeTaken |
| SharedExam | shareCode, title, questions[], ownerId, ownerName, active |
| ExamAttempt | playerName, score, total, timeTaken, selectedAnswers[] |

---

## Tính năng chi tiết

### 1. Xác thực người dùng (Authentication)

- **Đăng ký** bằng email/mật khẩu với tên hiển thị
- **Đăng nhập** bằng email/mật khẩu hoặc tài khoản Google
- Tự động tạo hồ sơ người dùng trên Firestore khi đăng ký
- Bảo vệ các trang chính bằng AuthContext - tự động chuyển hướng nếu chưa đăng nhập

### 2. Quản lý ngân hàng câu hỏi

- **Thêm câu hỏi** thủ công: nhập nội dung + 4 đáp án + chọn đáp án đúng
- **Sửa/Xóa** câu hỏi đã tạo
- **Tìm kiếm** câu hỏi trong ngân hàng
- **Import hàng loạt** từ file:
  - Hỗ trợ định dạng: Excel (.xlsx/.xls), CSV, JSON
  - Định dạng: Câu hỏi | Đáp án A | Đáp án B | Đáp án C | Đáp án D | Đáp án đúng
  - Xem trước dữ liệu trước khi import
  - Kiểm tra lỗi và hiển thị dòng không hợp lệ
  - Import tối đa 500 câu mỗi lần (Firestore batch limit)

### 3. Quản lý đề thi

- **Tạo đề thi**: đặt tên, mô tả, chọn câu hỏi từ ngân hàng, thiết lập thời gian
- **Sửa/Xóa** đề thi
- **Chia sẻ đề thi**: tạo link công khai để bất kỳ ai cũng có thể làm bài

### 4. Chế độ ôn tập (Practice Mode)

- Hệ thống tự động chọn **20 câu hỏi ngẫu nhiên** từ ngân hàng
- Trả lời từng câu - **kết quả hiển thị ngay** sau mỗi câu
- Không thể thay đổi câu trả lời đã chọn
- Kết thúc: hiển thị điểm và **xem lại chi tiết** từng câu

### 5. Chế độ thi (Exam Mode)

- Đồng hồ đếm ngược hiển thị trên header
- **Di chuyển tự do** giữa các câu hỏi qua lưới điều hướng
  - Xanh = đã trả lời, Trắng = chưa trả lời, Viền xanh = câu hiện tại
- **Tự động nộp bài** khi hết giờ
- Nộp bài thủ công với xác nhận (hiển thị số câu chưa trả lời)
- Kết quả: điểm, tỉ lệ đúng, thời gian làm bài, xem lại chi tiết

### 6. Chia sẻ đề thi & Bảng xếp hạng

- Tạo **link chia sẻ công khai** (mã 8 ký tự)
- Người nhận **không cần đăng nhập** - chỉ cần nhập tên
- Làm bài với đầy đủ tính năng (tính giờ, điều hướng, kết quả)
- **Bảng xếp hạng** (Leaderboard):
  - Top 50 người làm bài
  - Xếp hạng theo điểm (giảm dần) và thời gian (tăng dần)
  - Hiển thị biểu tượng cúp cho Top 3 (vàng/bạc/đồng)

### 7. Lịch sử làm bài

- **Tab Ôn tập**: danh sách các lần luyện tập với điểm và ngày
- **Tab Thi**: danh sách các lần thi với tên đề, điểm, thời gian
- **Xem chi tiết**: từng câu hỏi với đáp án đã chọn và đáp án đúng
- Phân loại đúng/sai bằng màu và biểu tượng

### 8. Dashboard (Trang chủ)

- **Lời chào** cá nhân hóa với tên người dùng
- **Hero card** hiển thị tổng số câu hỏi trong ngân hàng
- **Thống kê tổng quan**: tổng lượt làm bài, điểm trung bình, câu trả lời đúng
- **Biểu đồ điểm theo thời gian** (Line chart)
- **Biểu đồ tỉ lệ đúng/sai** (Pie chart)
- **Hoạt động gần đây**: 5 lần làm bài gần nhất với điểm và thời gian
- **Mục tiêu tuần**: thanh tiến trình và level
- **Thao tác nhanh**: ôn tập ngẫu nhiên, đề thi của tôi

### 9. Thống kê chi tiết (Stats)

- Tổng số lượt làm bài
- Điểm trung bình toàn bộ
- Tổng câu trả lời đúng
- Biểu đồ điểm theo thời gian (Recharts Line Chart)
- Biểu đồ tỉ lệ đúng/sai (Recharts Pie Chart)

---

## Luồng người dùng chính

### Luồng 1: Tạo và làm đề thi

```
Thêm câu hỏi (thủ công/import)
       |
       v
Tạo đề thi (chọn câu hỏi + thời gian)
       |
       v
Làm bài thi (tính giờ + điều hướng)
       |
       v
Xem kết quả + Xem lại chi tiết
       |
       v
Lịch sử lưu tự động
```

### Luồng 2: Chia sẻ đề thi

```
Tạo đề thi
    |
    v
Nhấn "Chia sẻ" -> Tạo link
    |
    v
Gửi link cho người khác
    |
    v
Người nhận mở link -> Nhập tên -> Làm bài
    |
    v
Kết quả hiển thị trên Bảng xếp hạng
```

### Luồng 3: Ôn tập

```
Vào "Ôn tập" -> Hệ thống chọn 20 câu ngẫu nhiên
       |
       v
Trả lời từng câu -> Thấy kết quả ngay
       |
       v
Xem tổng điểm + Xem lại chi tiết
```

---

## Thiết kế giao diện

### Responsive Design
- **Desktop**: Layout 2 cột (nội dung chính + sidebar)
- **Mobile**: Layout 1 cột, thanh điều hướng ở dưới (bottom nav)

### Thành phần giao diện
- shadcn/ui components: Button, Card, Dialog, Tabs, Table, Progress, Badge...
- Biểu đồ: Recharts (LineChart, PieChart)
- Icons: Lucide React
- Toast notifications: Sonner

### Design System
- Font: Inter (system font)
- Màu chính: Blue (Primary), Purple (Accent)
- Bo góc: 8px - 16px (rounded-lg to rounded-2xl)
- Shadow: nhẹ, phân tầng bằng border

---

## Bảo mật

- **Authentication**: Firebase Auth với email và Google OAuth
- **Authorization**: Firestore Security Rules đảm bảo:
  - Người dùng chỉ đọc/ghi dữ liệu của mình
  - Đề thi chia sẻ đọc công khai, chỉ chủ sở hữu được sửa/xóa
  - Bài làm công khai chỉ tạo 1 lần, không sửa được
- **Environment Variables**: API keys được quản lý qua Vercel env

---

## Testing

| Loại test | Công cụ | Phạm vi |
|---|---|---|
| Unit Test | Vitest | Helpers, validators, hooks |
| Integration Test | Vitest + Testing Library | Components, services |
| E2E Test | Playwright | Luồng người dùng |

---

## Deployment

- **Platform**: Vercel
- **Build**: `npm run build` (Next.js production build)
- **Root Directory**: `quiz-app/`
- **Environment Variables**: 6 biến Firebase (NEXT_PUBLIC_FIREBASE_*)
- **Domain**: Vercel auto-assigned + Firebase Authorized Domains

---

## Tổng kết tính năng

| STT | Tính năng | Mô tả |
|---|---|---|
| 1 | Đăng ký / Đăng nhập | Email + Google OAuth |
| 2 | Ngân hàng câu hỏi | CRUD + Import (Excel/CSV/JSON) |
| 3 | Quản lý đề thi | Tạo, sửa, xóa, chia sẻ |
| 4 | Ôn tập ngẫu nhiên | 20 câu, kết quả ngay |
| 5 | Thi có tính giờ | Đếm ngược, điều hướng tự do, tự động nộp |
| 6 | Chia sẻ công khai | Link không cần đăng nhập |
| 7 | Bảng xếp hạng | Top 50, xếp theo điểm + thời gian |
| 8 | Lịch sử làm bài | Ôn tập + Thi, xem chi tiết |
| 9 | Dashboard | Thống kê, biểu đồ, hoạt động gần đây |
| 10 | Thống kê chi tiết | Biểu đồ điểm, tỉ lệ đúng/sai |
| 11 | Responsive | Desktop + Mobile |
| 12 | Tiếng Việt | Toàn bộ giao diện |

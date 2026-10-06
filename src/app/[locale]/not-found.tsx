import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 text-center">
      <h1 className="text-6xl font-bold text-rose-500 mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-4">Page Not Found / Không tìm thấy trang</h2>
      <p className="text-slate-600 mb-6 text-sm">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-medium shadow-md transition-all"
      >
        Return Home / Về trang chủ
      </Link>
    </main>
  );
}

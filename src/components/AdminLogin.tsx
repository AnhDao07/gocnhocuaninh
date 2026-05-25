import React, { useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../db';
import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound, Star, Info } from 'lucide-react';

interface AdminLoginProps {
  onBackToHome: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onBackToHome,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorText('Vui lòng nhập đầy đủ thư điện tử và mật mã!');
      return;
    }

    setLoading(true);
    setErrorText('');

    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) {
            setErrorText(`Lỗi đăng nhập: ${error.message}`);
          } else if (data?.user) {
            onLoginSuccess(data.user.email || email);
          }
        } catch (err: any) {
          setErrorText(`Lỗi kết nối máy chủ Supabase: ${err.message || err}`);
        } finally {
          setLoading(false);
        }
        return;
      }
    }

    // IF NOT CONFIGURED: Allow demo mode login
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      
      {/* Return button */}
      <button 
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-sm text-vintage-gray hover:text-vintage-gold font-medium mb-8 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ độc giả
      </button>

      {/* Login Card wrapper */}
      <div className="bg-vintage-paper rounded-2xl border border-vintage-sepia p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-vintage-gold rounded-b-full shadow-[0_4px_20px_rgba(207,168,123,0.5)]" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-vintage-sepia text-vintage-gold flex items-center justify-center mx-auto mb-4 border border-vintage-gold/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="logo-font text-2xl font-bold text-vintage-gold tracking-wide">
            Đăng nhập người viết
          </h2>
          <p className="text-xs text-vintage-gray mt-1.5 uppercase tracking-wider font-mono">
            Khóa ấn thư phòng bảo mật
          </p>
        </div>

        {/* Demo login instructions */}
        {!isSupabaseConfigured && (
          <div className="p-4 bg-amber-950/20 border border-amber-900/30 text-amber-300 rounded-xl mb-6 text-xs flex gap-2 leading-relaxed">
            <Info className="w-5 h-5 shrink-0 text-vintage-gold" />
            <div>
              <p className="font-bold">Chế độ giả lập (Demo Mode)</p>
              <p className="mt-0.5 font-mono">
                Supabase chưa được điền thông số. Bạn có thể gõ bất kỳ email và mật khẩu (Ví dụ: <span className="text-white hover:underline cursor-pointer">admin@ninh.vn</span> / <span className="text-white">admin123</span>) để đăng nhập trải nghiệm bảng điều khiển ngay!
              </p>
            </div>
          </div>
        )}

        {errorText && (
          <div className="p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs rounded-lg mb-6 flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Login form inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Thư Điện Tử (Email)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-vintage-gray pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chubut@gocnhoninh.vn"
                className="w-full bg-vintage-dark border border-vintage-sepia rounded-xl pl-10 pr-4 py-2.5 text-vintage-text focus:outline-none focus:border-vintage-gold text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Mật Mã (Password)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-vintage-gray pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-vintage-dark border border-vintage-sepia rounded-xl pl-10 pr-4 py-2.5 text-vintage-text focus:outline-none focus:border-vintage-gold text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-vintage-gold text-vintage-dark font-bold font-mono rounded-xl hover:bg-white hover:scale-101 active:scale-99 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase cursor-pointer"
          >
            {loading ? 'Đang giải mã...' : 'Khởi ấn Đăng Nhập'}
          </button>

        </form>

      </div>
    </div>
  );
};

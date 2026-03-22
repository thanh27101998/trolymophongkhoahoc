import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6 px-4 mt-auto border-t border-slate-700 no-print">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-slate-400">Tác giả</p>
          <p className="text-lg font-bold text-white">Cô Vũ Phương Thanh</p>
          <p className="text-sm text-slate-300">Giáo viên Trường Tiểu Học Đại Phú</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
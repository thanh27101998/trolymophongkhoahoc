import React, { useState } from 'react';
import { Sparkles, Settings, Loader2, Check, Upload, FileText, Zap, RotateCcw } from 'lucide-react';
import { DEVICE_OPTIONS, SimulationParams, UploadedFile, AIResult } from '../types';
import FileUploader from './FileUploader';
import ResultGenerated from './ResultGenerated';

interface SimulationFormProps {
  grade: string;
  topicName: string;
  lessonTitle: string;
  onGenerate: (params: SimulationParams) => Promise<void>;
  isLoading: boolean;
  aiResult: AIResult | null;
  status: 'idle' | 'generating' | 'generated' | 'error';
  onReset: () => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  grade,
  topicName,
  lessonTitle,
  onGenerate,
  isLoading,
  aiResult,
  status,
  onReset,
}) => {
  const [parameters, setParameters] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [devices, setDevices] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleDeviceChange = (deviceLabel: string) => {
    setDevices(prev =>
      prev.includes(deviceLabel)
        ? prev.filter(d => d !== deviceLabel)
        : [...prev, deviceLabel]
    );
  };

  const handleSubmit = () => {
    onGenerate({
      grade: `Lớp ${grade}`,
      topicName,
      lessonTitle,
      parameters: parameters || undefined,
      expectedResult: expectedResult || undefined,
      devices,
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    });
  };

  // If generated, show result
  if (status === 'generated' && aiResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-700">Kết quả mô phỏng</h2>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-all"
          >
            <RotateCcw size={16} />
            Tạo lại
          </button>
        </div>
        <ResultGenerated data={aiResult} topic={lessonTitle} />
      </div>
    );
  }

  const deviceColors = [
    'from-blue-500 to-cyan-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-green-500 to-emerald-500',
  ];

  return (
    <div className="space-y-8">
      {/* Lesson Info Card */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-200/50">
        <p className="text-teal-100 text-xs font-bold uppercase tracking-wider mb-1">Lớp {grade} • {topicName}</p>
        <h2 className="text-xl md:text-2xl font-bold leading-tight">{lessonTitle}</h2>
        <p className="text-teal-100/80 text-sm mt-2">AI sẽ tạo mô phỏng tương tác cho bài học này</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="size-8 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
            <Settings size={16} />
          </div>
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Tùy chỉnh mô phỏng</span>
        </div>

        {/* Parameters */}
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Settings size={12} className="text-slate-400" />
            Thông số điều chỉnh
          </span>
          <textarea
            rows={2}
            value={parameters}
            onChange={e => setParameters(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all text-sm py-3 px-4 resize-none hover:border-slate-300"
            placeholder="Ví dụ: nhiệt độ nước, góc ánh sáng, tốc độ gió..."
          />
        </label>

        {/* Expected Result */}
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Zap size={12} className="text-amber-500" />
            Kết quả mong muốn
          </span>
          <textarea
            rows={2}
            value={expectedResult}
            onChange={e => setExpectedResult(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all text-sm py-3 px-4 resize-none hover:border-amber-300"
            placeholder="Ví dụ: Học sinh quan sát được hiện tượng bay hơi của nước..."
          />
        </label>

        {/* Devices */}
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase block mb-3">Thiết bị hiển thị</span>
          <div className="grid grid-cols-2 gap-2">
            {DEVICE_OPTIONS.map((device, idx) => {
              const isSelected = devices.includes(device.label);
              return (
                <label
                  key={device.id}
                  className={`
                    flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? `bg-gradient-to-r ${deviceColors[idx]} text-white border-transparent shadow-md`
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className={`size-5 rounded-md flex items-center justify-center transition-all ${isSelected ? 'bg-white/30' : 'border-2 border-slate-300'}`}>
                    {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => handleDeviceChange(device.label)}
                  />
                  <span className="text-xs font-bold">{device.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* File Upload Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all ${showUpload ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <Upload size={16} />
            {showUpload ? 'Ẩn phần upload file' : 'Tải file bài tập bổ sung'}
          </button>

          {showUpload && (
            <div className="mt-3 space-y-3">
              <FileUploader
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxFiles={5}
                maxSizeMB={10}
              />
              <p className="text-xs text-violet-600 font-medium bg-violet-50 rounded-lg px-3 py-2 border border-violet-100">
                ✨ AI sẽ phân tích nội dung file và tạo mô phỏng tương ứng
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700">
          <h3 className="font-bold text-lg mb-2">Đã xảy ra lỗi</h3>
          <p className="text-red-600/70 text-sm mb-4">Không thể kết nối với AI. Vui lòng kiểm tra API Key và thử lại.</p>
          <button onClick={onReset} className="bg-white border border-red-200 text-red-600 font-bold py-2 px-6 rounded-xl hover:bg-red-50 transition">
            Thử lại
          </button>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={22} />
        ) : (
          <Sparkles size={22} className="text-yellow-300 drop-shadow-lg" />
        )}
        <span className="text-base">
          {isLoading ? 'Đang tạo mô phỏng...' : 'Tạo mô phỏng AI'}
        </span>
      </button>
    </div>
  );
};

export default SimulationForm;

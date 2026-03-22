import { GoogleGenAI } from "@google/genai";
import { SimulationParams, AIResult, UploadedFile } from "../types";

const SYSTEM_PROMPT = `
Bạn là chuyên gia lập trình web giáo dục chuyên về môn Khoa học lớp 4 và lớp 5 (chương trình Kết nối tri thức).
Nhiệm vụ: Tạo mô phỏng tương tác phù hợp cho học sinh tiểu học (9-11 tuổi).

Yêu cầu đặc biệt cho tiểu học:
- Giao diện THẬT ĐƠN GIẢN, màu sắc TRẺ TRUNG, chữ TO, dễ đọc
- Nút bấm lớn, dễ click, phù hợp trẻ em
- Hình ảnh minh họa sinh động, có animation nhẹ nhàng
- Ngôn ngữ đơn giản, dễ hiểu cho học sinh lớp 4-5
- Mô phỏng phải CHÍNH XÁC về mặt khoa học nhưng ĐƠN GIẢN hóa phù hợp lứa tuổi

Output Format: Bắt buộc sử dụng các separator sau để phân chia nội dung:
|||HTML_START|||
[Code HTML tại đây]
|||HTML_END|||
|||QUESTIONS_START|||
[Câu hỏi thực hành tại đây]
|||QUESTIONS_END|||
|||GUIDE_START|||
[Hướng dẫn sử dụng tại đây]
|||GUIDE_END|||
`;

const SYSTEM_PROMPT_FROM_FILE = `
Bạn là chuyên gia lập trình web giáo dục chuyên về môn Khoa học lớp 4 và lớp 5 (chương trình Kết nối tri thức).
Nhiệm vụ: Phân tích nội dung bài tập/tài liệu được cung cấp, sau đó tạo mô phỏng tương tác phù hợp.

Yêu cầu đặc biệt cho tiểu học:
- Giao diện THẬT ĐƠN GIẢN, màu sắc TRẺ TRUNG, chữ TO, dễ đọc
- Nút bấm lớn, dễ click, phù hợp trẻ em
- Hình ảnh minh họa sinh động, có animation nhẹ nhàng
- Ngôn ngữ đơn giản, dễ hiểu cho học sinh lớp 4-5

Quy trình:
1. Đọc và hiểu nội dung bài tập/tài liệu
2. Xác định chủ đề khoa học chính
3. Tạo mô phỏng HTML/CSS/JS tương tác minh họa cho chủ đề đó
4. Đảm bảo mô phỏng giúp học sinh hiểu rõ bài tập

Output Format: Bắt buộc sử dụng các separator sau:
|||HTML_START|||
[Code HTML tại đây]
|||HTML_END|||
|||QUESTIONS_START|||
[Câu hỏi thực hành tại đây]
|||QUESTIONS_END|||
|||GUIDE_START|||
[Hướng dẫn sử dụng tại đây]
|||GUIDE_END|||
`;

const FALLBACK_ORDER = ["gemini-3-flash-preview", "gemini-3-pro-preview", "gemini-2.5-flash"];

// Build multimodal content from files
const buildContentFromFiles = (files: UploadedFile[], params: SimulationParams): any[] => {
  const parts: any[] = [];

  let textPrompt = `
YÊU CẦU TẠO MÔ PHỎNG TỪ FILE BÀI TẬP

I. THÔNG TIN CONTEXT:
Lớp: ${params.grade}
Chủ đề: ${params.topicName}
Bài học: ${params.lessonTitle}
Thông số điều chỉnh: ${params.parameters || "Tự động xác định từ bài tập"}
Thiết bị: ${params.devices.length > 0 ? params.devices.join(", ") : "Mặc định"}

II. NỘI DUNG BÀI TẬP/TÀI LIỆU:
`;

  const textFiles = files.filter(f => f.type === 'text' || f.type === 'pdf');
  if (textFiles.length > 0) {
    textPrompt += `\n--- Nội dung văn bản trích xuất ---\n`;
    textFiles.forEach(file => {
      textPrompt += `\n[File: ${file.name}]\n${file.content}\n`;
    });
  }

  textPrompt += `
III. YÊU CẦU OUTPUT:
A. CODE MÔ PHỎNG HTML/CSS/JS
Viết code hoàn chỉnh (Single File) với yêu cầu:
- Giao diện đơn giản, trẻ trung, có tiêu đề và nút Reset.
- Phù hợp học sinh lớp 4-5 (9-11 tuổi): chữ to, nút lớn, màu sắc sinh động.
- Sử dụng Canvas/SVG để vẽ.
- Slider/input/checkbox để điều chỉnh thông số.
- Hiển thị giá trị real-time (số + hình ảnh).
- Tất cả nhãn bằng tiếng Việt.
- Chạy trên Chrome/Firefox/Edge (không cần plugin).
- Đảm bảo tính chính xác khoa học, đơn giản hóa phù hợp lứa tuổi.
- MÔ PHỎNG PHẢI LIÊN QUAN TRỰC TIẾP đến bài tập được cung cấp.

B. CÂU HỎI THỰC HÀNH (5-7 câu)
Theo cấu trúc:
- Câu 1-2: Quan sát hiện tượng (Em thấy gì khi...?)
- Câu 3-4: Đo đạc và ghi chép (Điền bảng số liệu...)
- Câu 5-6: Phân tích (Vì sao...? Điều gì xảy ra nếu...?)
- Câu 7: Liên hệ thực tế

C. HƯỚNG DẪN SỬ DỤNG CHO GIÁO VIÊN
- Các bước mở và chạy mô phỏng
- Cách chia sẻ với học sinh
- Gợi ý cách tổ chức hoạt động trên lớp

LƯU Ý QUAN TRỌNG: Hãy wrap các phần nội dung bằng các thẻ delimiter đã định nghĩa trong system prompt.
`;

  parts.push({ text: textPrompt });

  const imageFiles = files.filter(f => f.type === 'image');
  imageFiles.forEach(file => {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.content
      }
    });
  });

  return parts;
};

// Parse AI response
const parseAIResponse = (text: string): AIResult => {
  const htmlMatch = text.match(/\|\|\|HTML_START\|\|\|([\s\S]*?)\|\|\|HTML_END\|\|\|/);
  const questionsMatch = text.match(/\|\|\|QUESTIONS_START\|\|\|([\s\S]*?)\|\|\|QUESTIONS_END\|\|\|/);
  const guideMatch = text.match(/\|\|\|GUIDE_START\|\|\|([\s\S]*?)\|\|\|GUIDE_END\|\|\|/);

  let cleanHtml = htmlMatch ? htmlMatch[1].trim() : "";
  if (!cleanHtml) {
    const codeBlock = text.match(/```html\s*([\s\S]*?)```/);
    cleanHtml = codeBlock ? codeBlock[1] : "";
  }
  cleanHtml = cleanHtml.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

  if (!cleanHtml) {
    throw new Error("Model trả về dữ liệu không hợp lệ (Missing HTML)");
  }

  return {
    html: cleanHtml,
    questions: questionsMatch ? questionsMatch[1].trim() : "Không có câu hỏi được tạo.",
    guide: guideMatch ? guideMatch[1].trim() : "Không có hướng dẫn được tạo."
  };
};

export const generateSimulationContent = async (
  params: SimulationParams,
  apiKey: string,
  startModel: string = "gemini-3-flash-preview"
): Promise<AIResult> => {
  // Check if we have files - use multimodal approach
  if (params.uploadedFiles && params.uploadedFiles.length > 0) {
    return generateFromFiles(params.uploadedFiles, params, apiKey, startModel);
  }

  // Text-only approach
  const modelChain = [startModel, ...FALLBACK_ORDER.filter(m => m !== startModel)];
  let lastError: any;

  for (const model of modelChain) {
    try {
      console.log(`[AI] Attempting with model: ${model}`);
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
YÊU CẦU TẠO MÔ PHỎNG KHOA HỌC TIỂU HỌC

I. THÔNG TIN ĐẦU VÀO:
Lớp: ${params.grade}
Chủ đề: ${params.topicName}
Bài học: ${params.lessonTitle}
Thông số điều chỉnh: ${params.parameters || "Tự động xác định"}
Kết quả mong muốn: ${params.expectedResult || "Quan sát hiện tượng chung"}
Thiết bị: ${params.devices.length > 0 ? params.devices.join(", ") : "Mặc định"}

II. YÊU CẦU OUTPUT:
A. CODE MÔ PHỎNG HTML/CSS/JS
Viết code hoàn chỉnh (Single File) với yêu cầu:
- Giao diện đơn giản, trẻ trung, có tiêu đề và nút Reset.
- Phù hợp học sinh lớp 4-5 (9-11 tuổi): chữ to, nút lớn, màu sắc sinh động.
- Sử dụng Canvas/SVG để vẽ mô phỏng trực quan.
- Slider/input/checkbox để điều chỉnh thông số.
- Hiển thị giá trị real-time (số + hình ảnh).
- Tất cả nhãn bằng tiếng Việt.
- Chạy trên Chrome/Firefox/Edge (không cần plugin).
- Đảm bảo tính chính xác khoa học nhưng đơn giản hóa phù hợp lứa tuổi.

B. CÂU HỎI THỰC HÀNH (5-7 câu)
Theo cấu trúc:
- Câu 1-2: Quan sát hiện tượng (Em thấy gì khi...?)
- Câu 3-4: Đo đạc và ghi chép (Điền bảng số liệu...)
- Câu 5-6: Phân tích (Vì sao...? Điều gì xảy ra nếu...?)
- Câu 7: Liên hệ thực tế

C. HƯỚNG DẪN SỬ DỤNG CHO GIÁO VIÊN
- Các bước mở và chạy mô phỏng
- Cách chia sẻ với học sinh
- Gợi ý cách tổ chức hoạt động trên lớp
- Lưu ý kỹ thuật

LƯU Ý QUAN TRỌNG: Hãy wrap các phần nội dung bằng các thẻ delimiter đã định nghĩa trong system prompt.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });

      const text = response.text || "";
      return parseAIResponse(text);

    } catch (error: any) {
      console.warn(`[AI] Error with model ${model}:`, error);
      lastError = error;
      continue;
    }
  }

  console.error("All models failed.");
  if (lastError?.message?.includes("429") || lastError?.message?.includes("RESOURCE_EXHAUSTED")) {
    throw new Error(`Đã dừng do lỗi quá tải (429 RESOURCE_EXHAUSTED). Hết quota API.`);
  }
  throw new Error(`Không thể tạo mô phỏng. Lỗi: ${lastError?.message || "Unknown error"}`);
};

export const generateFromFiles = async (
  files: UploadedFile[],
  params: SimulationParams,
  apiKey: string,
  startModel: string = "gemini-3-flash-preview"
): Promise<AIResult> => {
  const modelChain = [startModel, ...FALLBACK_ORDER.filter(m => m !== startModel)];
  let lastError: any;

  for (const model of modelChain) {
    try {
      console.log(`[AI] Attempting multimodal with model: ${model}`);
      const ai = new GoogleGenAI({ apiKey });

      const contentParts = buildContentFromFiles(files, params);

      const response = await ai.models.generateContent({
        model: model,
        contents: contentParts,
        config: {
          systemInstruction: SYSTEM_PROMPT_FROM_FILE,
        }
      });

      const text = response.text || "";
      return parseAIResponse(text);

    } catch (error: any) {
      console.warn(`[AI] Error with model ${model}:`, error);
      lastError = error;
      continue;
    }
  }

  console.error("All models failed for file processing.");
  if (lastError?.message?.includes("429") || lastError?.message?.includes("RESOURCE_EXHAUSTED")) {
    throw new Error(`Đã dừng do lỗi quá tải (429 RESOURCE_EXHAUSTED). Hết quota API.`);
  }
  throw new Error(`Không thể tạo mô phỏng từ file. Lỗi: ${lastError?.message || "Unknown error"}`);
};
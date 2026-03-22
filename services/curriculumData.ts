export interface Lesson {
  id: string;
  title: string;
  page: number;
}

export interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
  lessons: Lesson[];
}

export interface GradeData {
  grade: string;
  label: string;
  color: string;
  topics: Topic[];
}

export const curriculumData: GradeData[] = [
  {
    grade: '4',
    label: 'Khoa học Lớp 4',
    color: '#16a34a',
    topics: [
      {
        id: 'l4-chat',
        name: 'Chủ đề 1. CHẤT',
        color: '#0ea5e9',
        icon: '💧',
        lessons: [
          { id: 'l4-b1', title: 'Bài 1. Tính chất của nước và nước với cuộc sống', page: 5 },
          { id: 'l4-b2', title: 'Bài 2. Sự chuyển thể của nước và vòng tuần hoàn của nước trong tự nhiên', page: 9 },
          { id: 'l4-b3', title: 'Bài 3. Sự ô nhiễm và bảo vệ nguồn nước. Một số cách làm sạch nước', page: 13 },
          { id: 'l4-b4', title: 'Bài 4. Không khí có ở đâu? Tính chất và thành phần của không khí', page: 17 },
          { id: 'l4-b5', title: 'Bài 5. Vai trò của không khí và bảo vệ bầu không khí trong lành', page: 21 },
          { id: 'l4-b6', title: 'Bài 6. Gió, bão và phòng chống bão', page: 25 },
          { id: 'l4-b7', title: 'Bài 7. Ôn tập chủ đề Chất', page: 29 },
        ]
      },
      {
        id: 'l4-nangl',
        name: 'Chủ đề 2. NĂNG LƯỢNG',
        color: '#f59e0b',
        icon: '⚡',
        lessons: [
          { id: 'l4-b8', title: 'Bài 8. Ánh sáng và sự truyền ánh sáng', page: 31 },
          { id: 'l4-b9', title: 'Bài 9. Vai trò của ánh sáng', page: 35 },
          { id: 'l4-b10', title: 'Bài 10. Âm thanh và sự truyền âm thanh', page: 39 },
          { id: 'l4-b11', title: 'Bài 11. Âm thanh trong cuộc sống', page: 42 },
          { id: 'l4-b12', title: 'Bài 12. Nhiệt độ và sự truyền nhiệt', page: 45 },
          { id: 'l4-b13', title: 'Bài 13. Vật dẫn nhiệt tốt, vật dẫn nhiệt kém', page: 48 },
          { id: 'l4-b14', title: 'Bài 14. Ôn tập chủ đề Năng lượng', page: 51 },
        ]
      },
      {
        id: 'l4-tv-dv',
        name: 'Chủ đề 3. THỰC VẬT VÀ ĐỘNG VẬT',
        color: '#22c55e',
        icon: '🌿',
        lessons: [
          { id: 'l4-b15', title: 'Bài 15. Thực vật cần gì để sống?', page: 53 },
          { id: 'l4-b16', title: 'Bài 16. Động vật cần gì để sống?', page: 59 },
          { id: 'l4-b17', title: 'Bài 17. Chăm sóc cây trồng, vật nuôi', page: 64 },
          { id: 'l4-b18', title: 'Bài 18. Ôn tập chủ đề Thực vật và động vật', page: 68 },
        ]
      },
      {
        id: 'l4-nam',
        name: 'Chủ đề 4. NẤM',
        color: '#a855f7',
        icon: '🍄',
        lessons: [
          { id: 'l4-b19', title: 'Bài 19. Đặc điểm chung của nấm', page: 70 },
          { id: 'l4-b20', title: 'Bài 20. Nấm ăn và nấm trong chế biến thực phẩm', page: 74 },
          { id: 'l4-b21', title: 'Bài 21. Nấm gây hỏng thực phẩm và nấm độc', page: 78 },
          { id: 'l4-b22', title: 'Bài 22. Ôn tập chủ đề Nấm', page: 82 },
        ]
      },
      {
        id: 'l4-cn-sk',
        name: 'Chủ đề 5. CON NGƯỜI VÀ SỨC KHỎE',
        color: '#ef4444',
        icon: '❤️',
        lessons: [
          { id: 'l4-b23', title: 'Bài 23. Vai trò của các chất dinh dưỡng đối với cơ thể', page: 84 },
          { id: 'l4-b24', title: 'Bài 24. Chế độ ăn uống cân bằng', page: 89 },
          { id: 'l4-b25', title: 'Bài 25. Một số bệnh liên quan đến dinh dưỡng', page: 93 },
          { id: 'l4-b26', title: 'Bài 26. Thực phẩm an toàn', page: 99 },
          { id: 'l4-b27', title: 'Bài 27. Phòng tránh đuối nước', page: 103 },
          { id: 'l4-b28', title: 'Bài 28. Ôn tập chủ đề Con người và sức khỏe', page: 106 },
        ]
      },
      {
        id: 'l4-sv-mt',
        name: 'Chủ đề 6. SINH VẬT VÀ MÔI TRƯỜNG',
        color: '#06b6d4',
        icon: '🌍',
        lessons: [
          { id: 'l4-b29', title: 'Bài 29. Chuỗi thức ăn trong tự nhiên', page: 109 },
          { id: 'l4-b30', title: 'Bài 30. Vai trò của thực vật trong chuỗi thức ăn', page: 114 },
          { id: 'l4-b31', title: 'Bài 31. Ôn tập chủ đề Sinh vật và môi trường', page: 120 },
        ]
      },
    ]
  },
  {
    grade: '5',
    label: 'Khoa học Lớp 5',
    color: '#2563eb',
    topics: [
      {
        id: 'l5-chat',
        name: 'Chủ đề 1. CHẤT',
        color: '#0ea5e9',
        icon: '🧪',
        lessons: [
          { id: 'l5-b1', title: 'Bài 1. Thành phần và vai trò của đất đối với cây trồng', page: 5 },
          { id: 'l5-b2', title: 'Bài 2. Ô nhiễm, xói mòn đất và bảo vệ môi trường đất', page: 9 },
          { id: 'l5-b3', title: 'Bài 3. Hỗn hợp và dung dịch', page: 14 },
          { id: 'l5-b4', title: 'Bài 4. Đặc điểm của chất ở trạng thái rắn, lỏng, khí. Sự biến đổi trạng thái của chất', page: 17 },
          { id: 'l5-b5', title: 'Bài 5. Sự biến đổi hoá học của chất', page: 21 },
          { id: 'l5-b6', title: 'Bài 6. Ôn tập chủ đề Chất', page: 25 },
        ]
      },
      {
        id: 'l5-nangl',
        name: 'Chủ đề 2. NĂNG LƯỢNG',
        color: '#f59e0b',
        icon: '🔋',
        lessons: [
          { id: 'l5-b7', title: 'Bài 7. Vai trò của năng lượng', page: 27 },
          { id: 'l5-b8', title: 'Bài 8. Sử dụng năng lượng điện', page: 30 },
          { id: 'l5-b9', title: 'Bài 9. Mạch điện đơn giản. Vật dẫn điện và vật cách điện', page: 34 },
          { id: 'l5-b10', title: 'Bài 10. Năng lượng chất đốt', page: 38 },
          { id: 'l5-b11', title: 'Bài 11. Sử dụng năng lượng mặt trời, năng lượng gió, năng lượng nước chảy', page: 42 },
          { id: 'l5-b12', title: 'Bài 12. Ôn tập chủ đề Năng lượng', page: 46 },
        ]
      },
      {
        id: 'l5-tv-dv',
        name: 'Chủ đề 3. THỰC VẬT VÀ ĐỘNG VẬT',
        color: '#22c55e',
        icon: '🌱',
        lessons: [
          { id: 'l5-b13', title: 'Bài 13. Sinh sản của thực vật có hoa', page: 48 },
          { id: 'l5-b14', title: 'Bài 14. Sự phát triển của cây con', page: 52 },
          { id: 'l5-b15', title: 'Bài 15. Sinh sản của động vật', page: 57 },
          { id: 'l5-b16', title: 'Bài 16. Vòng đời và sự phát triển của động vật', page: 60 },
          { id: 'l5-b17', title: 'Bài 17. Ôn tập chủ đề Thực vật và động vật', page: 64 },
        ]
      },
      {
        id: 'l5-vk',
        name: 'Chủ đề 4. VI KHUẨN',
        color: '#a855f7',
        icon: '🦠',
        lessons: [
          { id: 'l5-b18', title: 'Bài 18. Vi khuẩn xung quanh chúng ta', page: 66 },
          { id: 'l5-b19', title: 'Bài 19. Vi khuẩn có ích trong chế biến thực phẩm', page: 69 },
          { id: 'l5-b20', title: 'Bài 20. Vi khuẩn gây bệnh ở người và cách phòng tránh', page: 72 },
          { id: 'l5-b21', title: 'Bài 21. Ôn tập chủ đề Vi khuẩn', page: 75 },
        ]
      },
      {
        id: 'l5-cn-sk',
        name: 'Chủ đề 5. CON NGƯỜI VÀ SỨC KHỎE',
        color: '#ef4444',
        icon: '🧬',
        lessons: [
          { id: 'l5-b22', title: 'Bài 22. Sự hình thành cơ thể người', page: 77 },
          { id: 'l5-b23', title: 'Bài 23. Các giai đoạn phát triển chính của con người', page: 81 },
          { id: 'l5-b24', title: 'Bài 24. Nam và nữ', page: 85 },
          { id: 'l5-b25', title: 'Bài 25. Chăm sóc sức khỏe tuổi dậy thì', page: 89 },
          { id: 'l5-b26', title: 'Bài 26. Phòng tránh bị xâm hại', page: 93 },
          { id: 'l5-b27', title: 'Bài 27. Ôn tập chủ đề Con người và sức khỏe', page: 98 },
        ]
      },
      {
        id: 'l5-sv-mt',
        name: 'Chủ đề 6. SINH VẬT VÀ MÔI TRƯỜNG',
        color: '#06b6d4',
        icon: '🌏',
        lessons: [
          { id: 'l5-b28', title: 'Bài 28. Chuỗi năng lượng của môi trường đối với sinh vật', page: 100 },
          { id: 'l5-b29', title: 'Bài 29. Tác động của con người và một số biện pháp bảo vệ môi trường', page: 105 },
          { id: 'l5-b30', title: 'Bài 30. Ôn tập chủ đề Sinh vật và môi trường', page: 108 },
        ]
      },
    ]
  }
];

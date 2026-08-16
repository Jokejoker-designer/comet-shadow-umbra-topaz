# Kiến trúc Chat After-Train

## Nguyên tắc bắt buộc

```text
TRAIN
User / corpus
   ↓
Teacher LLM (optional)
   ↓
training examples
   ↓
Encoder
   ↓
8-Agent FPGA
   ↓
64 plastic weights update
```

Sau khi TRAIN kết thúc:

```text
AFTER-TRAIN

Teacher LLM ─────X DISCONNECTED

User text
   ↓
local encoder
   ↓
Basys 3 / 8-Agent / frozen weights
   ↓
response event / token code
   ↓
local decoder
   ↓
Chat UI
```

Không được gọi ChatGPT/Grok để tạo câu trả lời trong AFTER-TRAIN nếu mục tiêu là chứng minh FPGA đã học.

## Nguồn training

### A. Không tài liệu
Phù hợp chào hỏi/hội thoại cơ bản.

Teacher sinh hoặc người dùng cung cấp nhiều biến thể hội thoại. Ví dụ một curriculum có thể gồm:
- chào hỏi;
- xác nhận/phủ định;
- cảm ơn;
- tạm biệt;
- hỏi trạng thái đơn giản;
- các pattern ngữ cảnh ngắn.

Các nhãn/response chỉ được đưa vào từng TRAIN sample, không compile vào RTL.

### B. Có tài liệu
Dùng khi muốn hệ thống nói về một domain cụ thể.

Document → teacher LLM → tạo/kiểm tra training examples → FPGA TRAIN.

Tài liệu không nhất thiết nằm trên FPGA. Nó là nguồn xây curriculum.

### C. Teacher trực tiếp
OpenAI/xAI API có thể sinh sample từng bước và chấm output trong TRAIN.
Nên ghi mọi teacher transaction vào dataset/log để tái lập thí nghiệm.

Desktop chat UI chỉ nên dùng cho manual/human-in-the-loop training vì khó tự động hóa và khó tái lập.

## Anti-cheating gate

AFTER-TRAIN UI phải hiển thị:
- Teacher: DISCONNECTED
- External LLM calls: 0
- Learn: OFF
- Freeze: ON
- Weight writes: 0
- Response provenance: FPGA inference

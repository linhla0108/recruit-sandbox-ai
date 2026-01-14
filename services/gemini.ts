
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { RecruitmentData } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export class RecruitmentService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateRecruitmentSandbox(notes: string): Promise<RecruitmentData> {
    const prompt = `
      Act as a world-class hiring manager and talent strategist. 
      Convert the following raw hiring notes into a high-converting LinkedIn Job Description and a 10-question Behavioral Interview Guide.
      
      RAW NOTES:
      ${notes}

      REQUIREMENTS:
      1. Job Description: Professional, engaging, and formatted specifically for LinkedIn's layout.
      2. Interview Guide: Exactly 10 questions. Each must be behavioral (STAR method focused), targeting specific hard and soft skills identified in the JD.
    `;

    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobDescription: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                companyName: { type: Type.STRING },
                location: { type: Type.STRING },
                summary: { type: Type.STRING },
                responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                qualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                callToAction: { type: Type.STRING }
              },
              required: ["title", "summary", "responsibilities", "qualifications"]
            },
            interviewGuide: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  targetSkill: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  expectedIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["question", "targetSkill", "rationale"]
              }
            }
          },
          required: ["jobDescription", "interviewGuide"]
        }
      }
    });

    try {
      return JSON.parse(response.text) as RecruitmentData;
    } catch (e) {
      console.error("Failed to parse recruitment data:", e);
      throw new Error("Could not parse the AI's recruitment strategy. Please try again.");
    }
  }

  async *streamChat(message: string, currentNotes: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const contextStr = currentNotes ? `
      GHI CHÚ HIỆN TẠI TRONG SANDBOX:
      """
      ${currentNotes}
      """
    ` : "Chưa có ghi chú nào trong sandbox.";

    const systemInstruction = `
      Bạn là một Chuyên gia Tuyển dụng AI. Nhiệm vụ của bạn là giúp người dùng tinh chỉnh yêu cầu tuyển dụng của họ.
      
      Quy tắc trả lời:
      1. Trả lời mạch lạc, sử dụng nhiều dòng và dấu gạch đầu dòng để dễ đọc.
      2. Nếu người dùng yêu cầu thay đổi, thêm bớt hoặc chỉnh sửa nội dung tuyển dụng:
         a. Giải thích ngắn gọn bạn định thay đổi gì.
         b. Sau đó, tổng hợp lại TOÀN BỘ nội dung "Ghi chú tuyển dụng" mới bao gồm cả những thay đổi đó.
         c. Bọc nội dung ghi chú mới này trong thẻ: [REVISED_PROMPT]...nội dung ghi chú mới ở đây...[/REVISED_PROMPT]
      
      Mục tiêu của bạn là tạo ra một bản ghi chú đầy đủ, chi tiết hơn để khi đưa vào sandbox, AI sẽ tạo ra JD và bộ câu hỏi phỏng vấn chất lượng nhất.
      
      Ngữ cảnh hiện tại:
      ${contextStr}
    `;

    const chat = aiInstance.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 16000 }
      },
    });

    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      yield (chunk as GenerateContentResponse).text;
    }
  }
}

export const recruitmentService = new RecruitmentService();

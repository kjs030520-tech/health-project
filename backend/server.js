import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv'; 
import { GoogleGenerativeAI } from '@google/generative-ai';

// .env 파일의 환경 변수를 불러옵니다. (DB 비밀번호 등 숨김 목적)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors()); // 프론트엔드와 백엔드 포트가 달라도 통신 가능하게 함
app.use(express.json()); // 클라이언트가 보낸 JSON 데이터를 파싱함

// PostgreSQL 데이터베이스 연결 설정 (Connection Pool)
const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'health_db',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// DB 연결 테스트
pool.connect((err, client, release) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
  } else {
    console.log('PostgreSQL 데이터베이스 연결 성공!');
    release();
  }
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.get('/api/exercises', async (req, res) => {
  try {
    // exercises 테이블의 모든 데이터를 id 순서대로 가져옵니다.
    const result = await pool.query('SELECT * FROM exercises ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('DB 조회 에러:', err);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

// ==========================================
// 2. 운동 상세 페이지용 API: 진짜 DB에서 특정 운동 1개 가져오기
// ==========================================
app.get('/api/exercises/:id', async (req, res) => {
  const exerciseId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM exercises WHERE id = $1', [exerciseId]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('운동을 찾을 수 없습니다.');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB 상세 조회 에러:', err);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});
// ==========================================
// 3. AI 챗봇 API: 프론트엔드(AIChatbot.jsx)와 통신
// ==========================================
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  try {
    // gemini-1.5-flash 모델 사용 (텍스트 처리에 가장 빠르고 효율적임)
    // ✅ 모델 이름에 -latest 를 붙이거나, 1.5-pro 로 변경합니다.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // AI에게 '헬스 트레이너'라는 역할과 맥락(Context)을 부여하는 프롬프트 작성
    const prompt = `
      너는 이제부터 전문 헬스 트레이너이자 영양사야.
      사용자의 질문에 친절하고 전문적으로 대답해줘.
      답변은 너무 길지 않게 핵심만 요약해서 3~4문장으로 해줘.
      특히 근손실 방지와 하루 140g~160g의 단백질 섭취를 목표로 하는 식단 구성을 중시하는 방향으로 조언해주면 좋아.
      
      사용자 질문: ${userMessage}
    `;

    // Gemini API에 프롬프트 전송 및 답변 대기
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiReply = response.text(); // AI가 생성한 텍스트 추출

    // 프론트엔드로 실제 AI의 답변 전송
    res.json({ reply: aiReply });

  } catch (error) {
    console.error('Gemini API 통신 에러:', error);
    res.status(500).json({ reply: "AI 트레이너가 잠시 휴식 중입니다. 나중에 다시 질문해 주세요!" });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
import { useState } from 'react';

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const askAI = async () => {
    if (!question.trim()) return;
    
    // 사용자 질문 화면에 추가
    setChatLog([...chatLog, { sender: 'user', text: question }]);
    
    try {
      // 백엔드 서버로 질문 전송
      const response = await fetch('https://health-project-sie2.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      });
      const data = await response.json();
      
      // AI 답변 화면에 추가
      setChatLog(prev => [...prev, { sender: 'ai', text: data.reply }]);
      setQuestion('');
    } catch (error) {
      console.error('AI 연결 실패:', error);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '300px' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ width: '100%' }}>
        {isOpen ? 'AI 챗봇 닫기' : 'AI 헬스트레이너에게 질문하기'}
      </button>

      {isOpen && (
        <div style={{ border: '1px solid #ccc', background: 'white', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'scroll', padding: '10px' }}>
            {chatLog.map((chat, idx) => (
              <div key={idx} style={{ textAlign: chat.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}>
                <strong>{chat.sender === 'user' ? '나' : 'AI'}: </strong> {chat.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex' }}>
            <input 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && askAI()}
              style={{ flex: 1 }}
            />
            <button onClick={askAI}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChatbot;
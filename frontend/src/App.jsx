import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ✅ 사진에 있는 실제 파일명과 폴더명(소문자)으로 경로를 수정함
import Home from './pages/home';
import Detail from './pages/exerdetail';
import AIChatbot from './component/aichat'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 메인 라우팅 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:id" element={<Detail />} />
        </Routes>
        
        {/* AI 챗봇 */}
        <AIChatbot />
      </div>
    </Router>
  );
}

export default App;
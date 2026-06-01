import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 백엔드 API에서 전체 운동 목록 가져오기
    const fetchExercises = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://health-project-sie2.onrender.com';
        const response = await fetch(`${API_URL}/api/exercises`);
        const data = await response.json();
        // ID 순서대로 정렬 (1~6)
        const sortedData = data.sort((a, b) => a.id - b.id);
        setExercises(sortedData);
      } catch (error) {
        console.error('운동 데이터를 불러오는데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>;

  // --- CSS 스타일 정의 ---
  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3열 설정
    gap: '20px', // 카드 간격
    padding: '20px',
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden', // 이미지가 둥근 모서리를 벗어나지 않게
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // 살짝 그림자 효과
    transition: 'transform 0.2s', // 마우스 올렸을 때 효과
  };

  const imageStyle = {
    width: '100%',
    height: '200px', // 이미지 높이 고정
    objectFit: 'cover', // 비율 유지하며 꽉 채우기
    borderBottom: '1px solid #ddd',
  };

  const contentStyle = {
    padding: '15px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // 남은 공간 채우기
    justifyContent: 'space-between' // 버튼을 아래로 밀기
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>🏋️‍♂️ 추천 운동 가이드</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>원하는 운동을 선택해 자세한 방법을 알아보세요.</p>
      
      {/* 2*3 그리드 컨테이너 */}
      <div style={gridContainerStyle}>
        {exercises.map(ex => (
          <div key={ex.id} style={cardStyle} className="exercise-card">
            {/* 데이터베이스 ID와 매칭되는 이미지 출력 */}
            <img 
              src={`/image/ex${ex.id}.png`} 
              alt={ex.name} 
              style={imageStyle}
            />
            
            <div style={contentStyle}>
              <h3 style={{ margin: '0 0 10px 0' }}>{ex.name}</h3>
              <p style={{ fontSize: '14px', color: '#777', flexGrow: 1, marginBottom: '15px' }}>
                {ex.description.substring(0, 50)}...
              </p>
              <Link to={`/exercise/${ex.id}`}>
                <button style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  자세히 보기
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
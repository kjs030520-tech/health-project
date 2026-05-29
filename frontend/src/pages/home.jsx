import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 백엔드 API에서 전체 운동 목록 가져오기
    const fetchExercises = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://health-project-sie2.onrender.com';
        const response = await fetch(`${API_URL}/api/exercises`);
        const data = await response.json();
        setExercises(data); // DB에서 가져온 6개 데이터를 상태에 저장
      } catch (error) {
        console.error('운동 데이터를 불러오는데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>데이터를 불러오는 중입니다...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>추천 운동 가이드</h1>
      <p>원하는 운동을 선택해 자세한 방법을 알아보세요.</p>
      
      <div className="exercise-list">
        {exercises.map(ex => (
          <div key={ex.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
            <h3>{ex.name}</h3>
            {/* DB의 컬럼명이 description이므로 맞게 출력 */}
            <p>{ex.description}</p>
            <Link to={`/exercise/${ex.id}`}>
              <button>자세히 보기</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
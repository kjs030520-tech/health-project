import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Detail() {
  // URL에서 운동 ID 추출 (예: /exercise/1 -> id는 '1')
  const { id } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로컬 스토리지에 데이터 저장하는 함수
  const saveToRecentViewed = (currentExercise) => {
    const existing = localStorage.getItem('recentExercises');
    let recentList = existing ? JSON.parse(existing) : [];

    // 중복 제거 및 최신 데이터를 배열 맨 앞에 추가
    recentList = recentList.filter(item => item.id !== currentExercise.id);
    recentList.unshift({ id: currentExercise.id, name: currentExercise.name });

    // 최대 5개까지만 저장하도록 제한
    if (recentList.length > 5) recentList.pop();

    localStorage.setItem('recentExercises', JSON.stringify(recentList));
  };
  
  useEffect(() => {
    // 1. 백엔드 API에서 특정 운동 상세 정보 가져오기
    const fetchExerciseDetail = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://health-project-sie2.onrender.com';
        const response = await fetch(`${API_URL}/api/exercises/${id}`);
        if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
        
        const data = await response.json();
        setExercise(data);

        // 2. [과제 필수 조건] Web Storage (localStorage) 활용
        // '최근 본 운동' 목록을 로컬 스토리지에 저장 및 업데이트
        saveToRecentViewed(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [id]);

  

  // 로딩 및 에러 처리 화면
  if (loading) return <div>데이터를 불러오는 중입니다...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!exercise) return <div>운동 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← 뒤로 가기
      </button>

      {/* 운동 상세 정보 UI */}
      <div style={{ border: '1px solid #ddd', padding: '30px', borderRadius: '8px' }}>
        <h1 style={{ color: '#2c3e50' }}>{exercise.name}</h1>
        
        <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>운동 타겟 부위</h3>
          <p><strong>{exercise.target_muscle || '전신'}</strong></p>
        </div>

        <div>
          <h3>상세 운동 방법</h3>
          <p style={{ lineHeight: '1.6' }}>
            {exercise.description || exercise.detail}
          </p>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e8f4f8', borderLeft: '5px solid #3498db' }}>
          <strong>💡 영양 섭취 팁:</strong> 
          <p style={{ margin: '5px 0 0 0' }}>근손실 방지와 확실한 회복을 위해 하루 140g~160g의 단백질 섭취를 목표로 식단을 구성해 보세요.</p>
        </div>
      </div>
    </div>
  );
}

export default Detail;
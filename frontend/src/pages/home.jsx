import { Link } from 'react-router-dom';

function Home() {
  // DB에서 가져올 임시 운동 데이터
  const exercises = [
    { id: 1, name: '벤치 프레스', desc: '대흉근 발달을 위한 필수 근력 운동' },
    { id: 2, name: '데드리프트', desc: '전신 근력 및 코어 강화' },
    { id: 3, name: '스쿼트', desc: '하체 근력과 근육량 증가의 꽃' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>추천 운동 가이드</h1>
      <p>원하는 운동을 선택해 자세한 방법을 알아보세요.</p>
      
      <div className="exercise-list">
        {exercises.map(ex => (
          <div key={ex.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px' }}>
            <h3>{ex.name}</h3>
            <p>{ex.desc}</p>
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
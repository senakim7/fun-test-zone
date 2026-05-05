import React, { useState, useEffect, useCallback } from 'react';
import './App.css';


const QUIZ_QUESTIONS = [
  { q: "주말 아침, 한정판 스니커즈 선착순 발매 알림이 울렸다!", options: [{ text: "일단 무지성 클릭! 결제창부터 띄우고 본다.", type: 'P' }, { text: "미리 로그인해 두고 결제 수단까지 세팅해 둔 상태다.", type: 'J' }, { text: "단톡방에 알림을 공유하며 친구들과 함께 참전한다.", type: 'E' }, { text: "혼자 조용히 폰을 들고 집중해서 광클한다.", type: 'I' }] },
  { q: "모바일 게임에서 오랫동안 모은 재화로 드디어 가챠(뽑기)를 돌릴 시간!", options: [{ text: "'제발 떠라!' 감에 의존하며 단발 뽑기로 승부한다.", type: 'N' }, { text: "'천장까지 10회 남음' 확률표를 보며 확정을 노린다.", type: 'S' }, { text: "망했다... 길드 채팅창에 폭풍 하소연을 한다.", type: 'F' }, { text: "망했다... 남은 재화와 다음 픽업 일정을 계산한다.", type: 'T' }] },
  { q: "유튜브 브이로그 영상 편집을 막 시작하려는데...", options: [{ text: "폴더별로 영상 소스를 분류하고 BGM부터 쫙 깔아둔다.", type: 'J' }, { text: "일단 타임라인에 영상 다 던져넣고 삘대로 컷 편집 시작!", type: 'P' }, { text: "요즘 유행하는 밈이나 화려한 트랜지션 효과를 넣고 싶다.", type: 'N' }, { text: "시청자들이 보기 편하게 자막 싱크와 오디오 볼륨부터 맞춘다.", type: 'S' }] },
  { q: "하체(레그 프레스)를 빡세게 조진 다음 날, 5kg 배낭 럭킹을 하러 나왔다.", options: [{ text: "어제 하체를 털었으니 정해둔 코스만 딱 걷고 귀가한다.", type: 'J' }, { text: "걷다 보니 컨디션이 괜찮네? 발길 닿는 대로 더 걸어본다.", type: 'P' }, { text: "스쳐 지나가는 풍경과 사람들을 구경하며 걷는다.", type: 'S' }, { text: "이어폰을 꽂고 '내가 이 길의 주인공'이라는 상상에 빠진다.", type: 'N' }] },
  { q: "친구가 '나 오늘 너무 우울해서 신발 하나 질렀어'라고 한다면?", options: [{ text: "무슨 일 있어? 왜 우울해 ㅠㅠ", type: 'F' }, { text: "헐 진짜? 뭐 샀어? 사진 보여줘!", type: 'S' }, { text: "우울한데 신발을 왜 사...?", type: 'T' }, { text: "기분 전환엔 쇼핑이 최고지! 나도 같이 구경할래.", type: 'E' }] },
  { q: "처음 보는 사람들과 스터디/모임을 가지게 되었다.", options: [{ text: "먼저 인사를 건네고 분위기 메이커 역할을 자처한다.", type: 'E' }, { text: "누군가 말을 걸어줄 때까지 조용히 미소만 짓고 있는다.", type: 'I' }, { text: "모임의 목적과 앞으로의 구체적인 진행 방식이 궁금하다.", type: 'T' }, { text: "사람들의 인상과 모임의 전체적인 분위기를 파악한다.", type: 'F' }] },
  { q: "오랜만에 쉬는 날, 나의 하루 일정은?", options: [{ text: "오전 10시 헬스, 오후 2시 카페... 시간 단위로 계획이 있다.", type: 'J' }, { text: "일단 늦잠 푹 자고 눈떠서 제일 끌리는 것을 한다.", type: 'P' }, { text: "밀린 예능이나 유튜브를 보며 침대와 한 몸이 된다.", type: 'I' }, { text: "날씨 좋네! 당장 친구들에게 연락해서 약속을 잡는다.", type: 'E' }] },
  { q: "업무/과제 중 치명적인 오류를 발견했다!", options: [{ text: "이게 왜 안 되지? 원리를 깊게 파고들며 혼자 고민한다.", type: 'I' }, { text: "아 스트레스! 주변 사람들에게 에러 화면을 보여주며 탄식한다.", type: 'E' }, { text: "관련 공식 문서와 에러 로그를 꼼꼼하게 역추적한다.", type: 'S' }, { text: "혹시 이렇게 하면 되지 않을까? 새로운 꼼수를 시도해본다.", type: 'N' }] },
  { q: "새로운 전자기기(태블릿, 스마트폰 등)를 샀을 때", options: [{ text: "설명서를 정독하며 기본 세팅부터 완벽하게 맞춘다.", type: 'S' }, { text: "설명서는 버려! 일단 이것저것 눌러보며 기능들을 찾아낸다.", type: 'N' }, { text: "언박싱 하는 순간의 감동을 즐기며 디자인에 감탄한다.", type: 'F' }, { text: "이전 기기와의 벤치마크 성능 차이부터 테스트해 본다.", type: 'T' }] },
  { q: "여행을 떠나기 전날 밤, 나의 모습은?", options: [{ text: "맛집 리스트, 교통편, 플랜B까지 완벽하게 정리 완료.", type: 'J' }, { text: "짐은 내일 아침에 싸면 되지 뭐~", type: 'P' }, { text: "여행지에서 생길 로맨스나 돌발 상황을 혼자 상상해 본다.", type: 'N' }, { text: "챙겨야 할 준비물 리스트를 하나하나 체크하며 가방에 넣는다.", type: 'S' }] }
];

const RESULT_DATA = {
  ESTJ: { title: "완벽주의 마스터", desc: "체계적이고 리더십 넘치는 당신! 취미 생활도 일처럼 완벽하게 해내네요." },
  ENTJ: { title: "전략적 야망가", desc: "효율과 성취를 중요시하는 당신. 가챠를 돌릴 때도 철저한 계산은 필수!" },
  ESFJ: { title: "핵인싸 콜렉터", desc: "사람들을 좋아하고 챙기는 성격! 좋은 걸 얻으면 동네방네 자랑해야 직성이 풀려요." },
  ENFJ: { title: "열정의 길잡이", desc: "긍정적인 에너지가 넘치는 당신. 주변 사람들에게 늘 좋은 영향을 줍니다." },
  ESTP: { title: "행동파 승부사", desc: "스릴을 즐기고 적응력이 빠른 당신! 무지성 클릭도 결국 성공으로 이끌어내죠." },
  ENTP: { title: "기발한 탐험가", desc: "새로운 자극을 사랑하는 당신. 뻔한 길보다는 나만의 독특한 취미를 개척합니다." },
  ESFP: { title: "자유로운 영혼", desc: "현재의 즐거움이 가장 중요한 당신! 필 받으면 어디든 떠날 수 있는 에너자이저입니다." },
  ENFP: { title: "상상력 뱅크", desc: "아이디어가 넘치는 당신. 브이로그를 만들면 기발한 편집으로 사람들을 놀라게 할 거예요." },
  ISTJ: { title: "우직한 장인", desc: "책임감이 강하고 꼼꼼한 당신. 루틴을 철저히 지키며 조용히 강한 타입입니다." },
  INTJ: { title: "고독한 설계자", desc: "분석적이고 독립적인 당신. 누구보다 빠르게 시스템의 원리를 파악해냅니다." },
  ISFJ: { title: "섬세한 수호자", desc: "조용하지만 따뜻한 당신. 남들의 디테일한 변화도 가장 먼저 눈치채는 센스쟁이!" },
  INFJ: { title: "통찰의 예언가", desc: "직관력이 뛰어난 당신. 겉으로는 조용해 보이지만 속에는 거대한 우주를 품고 있어요." },
  ISTP: { title: "만능 재주꾼", desc: "호기심 많고 도구 다루기에 능숙한 당신. 오류가 나면 뚝딱뚝딱 다 고쳐냅니다." },
  INTP: { title: "논리적 사색가", desc: "이해력이 빠르고 호기심이 많은 당신. 꽂히는 분야가 생기면 끝장을 봅니다." },
  ISFP: { title: "평화로운 예술가", desc: "다정하고 유연한 당신. 예술적 감각이 뛰어나서 디자인이나 꾸미기에 소질이 있어요." },
  INFP: { title: "낭만적 몽상가", desc: "감수성이 풍부한 당신. 혼자 럭킹을 하며 음악을 듣는 시간이 가장 행복합니다." }
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const createEmptyBoard = () => Array.from(Array(BOARD_HEIGHT), () => new Array(BOARD_WIDTH).fill(0));

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#2b90ce' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#339af0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#e67e22' },
  O: { shape: [[1, 1], [1, 1]], color: '#f1c40f' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#27ae60' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#9b59b6' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#e74c3c' },
};

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS);
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOS[randKey];
};

export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [mbtiScores, setMbtiScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [finalMBTI, setFinalMBTI] = useState('');

  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState({ pos: { x: 0, y: 0 }, tetromino: [[0]], color: 'transparent' });
  const [gameOver, setGameOver] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  const goHome = () => { 
    setCurrentView('home'); 
    setCurrentQuestion(0); 
    setMbtiScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setGameOver(false); 
  };

  const handleAnswer = (type) => {
    // 버튼 클릭 시 약간의 지연을 주어 애니메이션을 감상할 수 있게 함
    setTimeout(() => {
      const newScores = { ...mbtiScores, [type]: mbtiScores[type] + 1 };
      setMbtiScores(newScores);

      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const result = 
          (newScores.E >= newScores.I ? 'E' : 'I') +
          (newScores.S >= newScores.N ? 'S' : 'N') +
          (newScores.T >= newScores.F ? 'T' : 'F') +
          (newScores.J >= newScores.P ? 'J' : 'P');
        setFinalMBTI(result);
        setCurrentView('quizResult');
      }
    }, 150); // 0.15초 지연
  };

  const handleShare = async () => {
    const shareData = { title: '일상 생존 유형 테스트', text: `내 결과는 [${RESULT_DATA[finalMBTI]?.title}]! 너도 한번 해볼래?`, url: window.location.href };
    if (navigator.share) { try { await navigator.share(shareData); } catch (err) { console.error(err); } } 
    else { navigator.clipboard.writeText(window.location.href); alert('링크가 복사되었습니다!'); }
  };

  const resetPlayer = useCallback(() => {
    const newBlock = randomTetromino();
    setPlayer({ pos: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newBlock.shape[0].length / 2), y: 0 }, tetromino: newBlock.shape, color: newBlock.color });
  }, []);

  const startGame = () => {
    setBoard(createEmptyBoard()); setGameOver(false); setGameScore(0); resetPlayer(); setCurrentView('tetris');
  };

  const checkCollision = (player, board, moveX, moveY) => {
    for (let y = 0; y < player.tetromino.length; y++) {
      for (let x = 0; x < player.tetromino[y].length; x++) {
        if (player.tetromino[y][x] !== 0) {
          const targetY = y + player.pos.y + moveY; const targetX = x + player.pos.x + moveX;
          if (targetY >= BOARD_HEIGHT || targetX < 0 || targetX >= BOARD_WIDTH || (targetY >= 0 && board[targetY][targetX] !== 0)) return true;
        }
      }
    }
    return false;
  };

  const drop = useCallback(() => {
    if (!checkCollision(player, board, 0, 1)) {
      setPlayer((prev) => ({ ...prev, pos: { x: prev.pos.x, y: prev.pos.y + 1 } }));
    } else {
      if (player.pos.y < 1) { setGameOver(true); return; }
      const newBoard = board.map(row => [...row]);
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => { if (value !== 0 && y + player.pos.y >= 0) newBoard[y + player.pos.y][x + player.pos.x] = player.color; });
      });

      let linesCleared = 0;
      const sweptBoard = newBoard.reduce((acc, row) => {
        if (row.findIndex(cell => cell === 0) === -1) { linesCleared += 1; acc.unshift(new Array(BOARD_WIDTH).fill(0)); return acc; }
        acc.push(row); return acc;
      }, []);

      if (linesCleared > 0) setGameScore(prev => prev + linesCleared * 100);
      setBoard(sweptBoard); resetPlayer();
    }
  }, [player, board, resetPlayer]);

  useEffect(() => {
    if (currentView !== 'tetris' || gameOver) return;
    const dropInterval = setInterval(drop, 800);
    return () => clearInterval(dropInterval);
  }, [currentView, gameOver, drop]);

  useEffect(() => {
    if (currentView !== 'tetris' || gameOver) return;
    const handleKeyDown = (e) => {
      if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) e.preventDefault();
      if (e.key === 'ArrowLeft' && !checkCollision(player, board, -1, 0)) setPlayer(p => ({ ...p, pos: { x: p.pos.x - 1, y: p.pos.y } }));
      if (e.key === 'ArrowRight' && !checkCollision(player, board, 1, 0)) setPlayer(p => ({ ...p, pos: { x: p.pos.x + 1, y: p.pos.y } }));
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') {
        const rotatedTetro = player.tetromino[0].map((_, index) => player.tetromino.map(col => col[index]).reverse());
        const clonedPlayer = JSON.parse(JSON.stringify(player)); clonedPlayer.tetromino = rotatedTetro;
        if (!checkCollision(clonedPlayer, board, 0, 0)) setPlayer(clonedPlayer);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, gameOver, player, board, drop]);

  const renderBoard = board.map(row => [...row]);
  if (currentView === 'tetris' && !gameOver) {
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + player.pos.y; const boardX = x + player.pos.x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) renderBoard[boardY][boardX] = player.color;
        }
      });
    });
  }

  return (
    <div className="app-container">
      <header className="github-header">
        <div className="header-logo" onClick={goHome}>
          <span className="logo-icon">📦</span> My Dashboard
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={goHome}>심리테스트</button>
          <button className="nav-btn" onClick={startGame}>미니게임</button>
        </nav>
      </header>

      <main className="github-main">
        <div className="content-card">
          
          {currentView === 'home' && (
            <div className="view-section home-view fade-in">
              <div className="main-logo-container">
                <img src="/logo.png" alt="FUN-TEST-ZONE Logo" className="main-logo-image" /> 
              </div>
              <h1 className="main-title">일상을 대하는 나의 생존 유형</h1>
              <p className="sub-title">스니커즈, 가챠, 운동 등 10가지 일상 속 성향 테스트 및 킬링타임용 테트리스를 제공합니다.</p>
              <div className="action-buttons row-layout">
                <button className="btn-primary large-btn pop-button" onClick={() => setCurrentView('quiz')}>
                  테스트 시작하기
                </button>
                <button className="btn-secondary large-btn pop-button" onClick={startGame}>
                  테트리스 플레이
                </button>
              </div>
            </div>
          )}

          {currentView === 'quiz' && (
            <div className="view-section quiz-view">
              <div className="progress-header">
                <span className="progress-text">Question {currentQuestion + 1} / {QUIZ_QUESTIONS.length}</span>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}></div>
                </div>
              </div>
              
              {/* ⭐ 이 부분이 핵심! key 값이 바뀌면서 애니메이션이 재실행됩니다. */}
              <div className="question-animate-wrapper" key={currentQuestion}>
                <h2 className="quiz-question">{QUIZ_QUESTIONS[currentQuestion].q}</h2>
                <div className="options-grid">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                    <button key={idx} className="btn-option" onClick={() => handleAnswer(opt.type)}>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'quizResult' && (
            <div className="view-section result-view fade-in-up">
              <div className="result-header">
                <span className="badge">Type: {finalMBTI}</span>
              </div>
              <h2 className="result-title">{RESULT_DATA[finalMBTI]?.title}</h2>
              <p className="result-desc">{RESULT_DATA[finalMBTI]?.desc}</p>
              
              <div className="action-buttons row-layout mt-4">
                <button className="btn-primary pop-button" onClick={handleShare}>결과 공유하기</button>
                <button className="btn-secondary pop-button" onClick={goHome}>처음으로</button>
              </div>
            </div>
          )}

          {currentView === 'tetris' && (
            <div className="view-section tetris-wrapper fade-in">
              <div className="tetris-info-panel">
                <h2 className="main-title">Tetris</h2>
                <div className="score-box">
                  <span>SCORE</span>
                  <strong>{gameScore}</strong>
                </div>
                <div className="controls-box">
                  <p><strong>[←] [→]</strong> 이동</p>
                  <p><strong>[↑]</strong> 회전</p>
                  <p><strong>[↓]</strong> 하강</p>
                </div>
                {gameOver && <p className="game-over-text">Game Over!</p>}
                <button className="btn-secondary mt-4 pop-button" onClick={goHome}>종료하기</button>
              </div>

              <div className="tetris-board-container">
                <div className="tetris-board">
                  {renderBoard.map((row, y) => 
                    row.map((cell, x) => (
                      <div key={`${y}-${x}`} className="tetris-cell" style={{ backgroundColor: cell === 0 ? '#ffffff' : cell }} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
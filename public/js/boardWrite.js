// boardWrite.js 파일
document.getElementById('boardWriteForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 막기
    // 필요한 데이터가 있다면 여기서 처리 가능
    window.location.href = '/boardList'; // 완료 후 boardList 페이지로 이동
});

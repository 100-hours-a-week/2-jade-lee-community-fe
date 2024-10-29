document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지
    // DB 확인 코드가 있는 경우 여기에 추가
    
    // boardList.html로 이동
    window.location.href = '/boardList';
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // DB 확인 코드가 있는 경우 여기에 추가
    
    window.location.href = '/boardList';
});

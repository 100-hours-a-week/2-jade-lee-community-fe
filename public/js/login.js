document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM이 완전히 로드되고 파싱되었습니다");

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailHelperText = document.createElement('div');
    emailHelperText.className = 'helper-text';
    emailInput.parentNode.appendChild(emailHelperText);

    const passwordHelperText = document.createElement('div');
    passwordHelperText.className = 'helper-text';
    passwordInput.parentNode.appendChild(passwordHelperText);

    const loginButton = document.querySelector('.login-button');

    // 초기 버튼 색상 설정
    loginButton.style.backgroundColor = '#ACA0EB'; // 기본 색상

    // 유효성 검사를 위한 변수
    let isFormValid = false;

    // 이메일 입력 검증
    emailInput.addEventListener('input', () => {
        const emailValue = emailInput.value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailValue) {
            emailHelperText.textContent = '* 이메일을 입력해주세요.';
            isFormValid = false;
        } else if (emailValue.length < 5 || !emailPattern.test(emailValue)) {
            emailHelperText.textContent = '* 올바른 이메일 주소 형식을 입력해주세요.';
            isFormValid = false;
        } else {
            emailHelperText.textContent = '';
            isFormValid = true; // 유효한 경우
        }
        checkFormValidity(); // 유효성 검사 확인
    });

    // 비밀번호 입력 검증
    passwordInput.addEventListener('input', () => {
        if (!passwordInput.value) {
            passwordHelperText.textContent = '* 비밀번호를 입력해주세요.';
            isFormValid = false;
        } else {
            passwordHelperText.textContent = '';
            isFormValid = true; // 유효한 경우
        }
        checkFormValidity(); // 유효성 검사 확인
    });

    // 유효성 검사 후 버튼 색상 변경
    function checkFormValidity() {
        if (isFormValid) {
            loginButton.style.backgroundColor = '#7F6AEE'; // 유효성 검사 통과 시 색상 변경
        } else {
            loginButton.style.backgroundColor = '#ACA0EB'; // 기본 색상
        }
    }

    // 폼 제출 시 이벤트 처리
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (isFormValid) {
            const email = emailInput.value;
            const password = passwordInput.value;

            // 서버에 로그인 요청
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }) // 이메일과 비밀번호를 JSON 형식으로 전송
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message); // 로그인 성공 메시지
                    window.location.href = '/boardList'; // 로그인 후 리디렉션
                } else {
                    alert(data.error); // 로그인 실패 메시지
                }
            })
            .catch((error) => {
                console.error('로그인 오류:', error);
                alert('서버와의 연결에 실패했습니다.');
            });
        } else {
            alert("모든 필드를 올바르게 입력해주세요.");
        }
    });
});

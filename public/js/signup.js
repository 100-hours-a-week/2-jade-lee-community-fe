document.addEventListener("DOMContentLoaded", function () {
    const imagePreview = document.getElementById('imagePreview');
    const profileImageInput = document.getElementById('profileImage'); // 파일 입력을 참조
    const emailInput = document.getElementById('email');
    const emailHelperText = emailInput.nextElementSibling;
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const passwordHelperText = passwordInput.nextElementSibling;
    const passwordConfirmHelperText = passwordConfirmInput.nextElementSibling;
    const nicknameInput = document.getElementById('nickname');
    const nicknameHelperText = nicknameInput.nextElementSibling;
    const helperText = document.querySelector('.helper-text.profile-image');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const loginForm = document.getElementById('loginForm');
    const signupButton = document.getElementById('signupButton');

    // 초기 미리보기 이미지 설정
    const defaultImageSrc = '/img/117885.png';
    imagePreview.src = defaultImageSrc;

    // 모든 유효성 검사를 통과했는지를 추적하는 변수
    let isFormValid = false;

    // 이미지 미리보기 기능
    profileImageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = 'block';
            helperText.textContent = '';
        } else {
            imagePreview.src = defaultImageSrc;
            helperText.textContent = '프로필 사진을 추가해주세요.';
        }
        checkFormValidity(); // 이미지 선택 후 유효성 검사 확인
    });

    // 클릭 시 파일 선택 창 열기
    imagePreview.addEventListener('click', () => {
        profileImageInput.click();
    });

    // 이메일 입력 검증
    emailInput.addEventListener('input', () => {
        const emailValue = emailInput.value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailValue) {
            emailHelperText.textContent = '* 이메일을 입력해주세요.';
            isFormValid = false;
        } else if (emailValue.length < 5 || !emailPattern.test(emailValue)) {
            emailHelperText.textContent = '* 이메일을 입력해주세요.\n예 (example@example.com)';
            isFormValid = false;
        } else {
            emailHelperText.textContent = '';
            isFormValid = true; // 유효한 경우
        }
        checkFormValidity(); // 유효성 검사 확인
    });

    // 비밀번호 입력 검증
    passwordInput.addEventListener('input', () => {
        const passwordValue = passwordInput.value;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

        if (!passwordValue) {
            passwordHelperText.textContent = '* 비밀번호를 입력해주세요.';
            isFormValid = false;
        } else if (!passwordPattern.test(passwordValue)) {
            passwordHelperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
            isFormValid = false;
        } else {
            passwordHelperText.textContent = '';
            isFormValid = true; // 유효한 경우
        }

        validatePasswordConfirmation(); // 비밀번호 확인 헬퍼 텍스트 업데이트
        checkFormValidity(); // 유효성 검사 확인
    });

    // 비밀번호 확인 입력 검증
    passwordConfirmInput.addEventListener('input', () => {
        if (!passwordConfirmInput.value) {
            passwordConfirmHelperText.textContent = '* 비밀번호를 한번 더 입력해주세요.';
            isFormValid = false;
        } else {
            passwordConfirmHelperText.textContent = '';
            isFormValid = true; // 유효한 경우
        }

        validatePasswordConfirmation();
        checkFormValidity(); // 유효성 검사 확인
    });

    // 비밀번호 확인 검증
    function validatePasswordConfirmation() {
        if (passwordInput.value && passwordConfirmInput.value) {
            if (passwordInput.value !== passwordConfirmInput.value) {
                passwordConfirmHelperText.textContent = '* 비밀번호가 다릅니다.';
                isFormValid = false;
            } else {
                passwordConfirmHelperText.textContent = ''; // 일치하는 경우
                isFormValid = true; // 유효한 경우
            }
        }
    }

    // 닉네임 입력 검증
    nicknameInput.addEventListener('input', () => {
        const nicknameValue = nicknameInput.value;

        nicknameHelperText.textContent = '';

        if (nicknameValue.trim() === '') {
            nicknameHelperText.textContent = '* 닉네임을 입력해주세요.';
            isFormValid = false;
        } else if (nicknameValue.includes(' ')) {
            nicknameHelperText.textContent = '* 띄어쓰기를 없애주세요.';
            isFormValid = false;
        } else if (nicknameValue.length > 10) {
            nicknameHelperText.textContent = '* 닉네임은 최대 10자 까지 작성 가능합니다.';
            isFormValid = false;
        } else {
            isFormValid = true; // 유효한 경우
        }
        checkFormValidity(); // 유효성 검사 확인
    });

    function checkFormValidity() {
        const isButtonEnabled = (
            emailHelperText.textContent === '' &&
            passwordHelperText.textContent === '' &&
            passwordConfirmHelperText.textContent === '' &&
            nicknameHelperText.textContent === '' &&
            helperText.textContent === ''
        );
        signupButton.disabled = !isButtonEnabled;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (isFormValid) {
            console.log("폼이 제출되었습니다!");

            const formData = new FormData();
            formData.append('profileImage', profileImageInput.files[0]); // imageInput -> profileImageInput으로 수정
            formData.append('email', emailInput.value);
            formData.append('password', passwordInput.value);
            formData.append('nickname', nicknameInput.value);

            fetch('/signup', {
                method: 'POST',
                body: formData // FormData 객체를 body로 전송
            })
            .then(response => response.json()) // JSON 파싱
            .then(data => {
                console.log(data); // JSON 응답 처리
                if (data.message) {
                    alert(data.message); // 회원가입 성공 메시지
                }
                window.location.href = '/login'; // 로그인 페이지로 리디렉션
            })
            .catch((error) => {
                console.error('회원가입 오류:', error);
            });            
        } else {
            console.log("폼이 유효하지 않습니다.");
        }
    });

    // 드롭다운 기능
    dropdown.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownContent.classList.toggle('show');
    });

    // 드롭다운 외부 클릭 시 메뉴 닫기
    window.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    // 드롭다운 메뉴 항목 클릭 시 페이지 이동
    dropdownContent.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const href = event.target.getAttribute('href');
            window.location.href = href;
        }
    });
});

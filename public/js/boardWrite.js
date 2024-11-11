document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const submitButton = document.querySelector('.write-button');
    const helperText = document.querySelector('.helper-text');

    // 버튼 색상 변경과 제목, 내용 입력 여부 체크
    function checkForm() {
        // 제목과 내용이 모두 입력되었으면 버튼 활성화
        if (titleInput.value.trim() !== '' && contentInput.value.trim() !== '') {
            submitButton.style.backgroundColor = '#7F6AEE';  // 제목과 내용이 모두 입력되면 버튼 색상 변경
            submitButton.disabled = false;  // 버튼 활성화
        } else {
            submitButton.style.backgroundColor = '#ACA0EB';  // 입력이 없으면 원래 색상으로 복원
            submitButton.disabled = true;  // 버튼 비활성화
        }
    }

    // 제목과 내용 입력을 실시간으로 체크
    titleInput.addEventListener('input', function() {
        checkForm(); // 실시간으로 상태 체크
        // 버튼 비활성화 상태에서 에러 메시지 업데이트
        if (titleInput.value.trim() === '') {
            helperText.textContent = '* 제목을 작성해주세요';
            helperText.style.display = 'block'; // 에러 메시지 표시
        } else if (contentInput.value.trim() === '') {
            helperText.textContent = '* 내용을 작성해주세요';
            helperText.style.display = 'block'; // 에러 메시지 표시
        } else {
            helperText.style.display = 'none'; // 에러 메시지 숨김
        }
    });

    contentInput.addEventListener('input', function() {
        checkForm(); // 실시간으로 상태 체크
        // 버튼 비활성화 상태에서 에러 메시지 업데이트
        if (contentInput.value.trim() === '') {
            helperText.textContent = '* 내용을 작성해주세요';
            helperText.style.display = 'block'; // 에러 메시지 표시
        } else if (titleInput.value.trim() === '') {
            helperText.textContent = '* 제목을 작성해주세요';
            helperText.style.display = 'block'; // 에러 메시지 표시
        } else {
            helperText.style.display = 'none'; // 에러 메시지 숨김
        }
    });

    // submit 버튼 클릭 시 boardList로 이동
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();  // 폼 제출을 막아서 페이지 리디렉션을 방지

        // 폼 제출 시에 입력값 체크
        console.log("폼 제출 시 실행됨");

        // 에러 메시지 초기화
        helperText.style.display = 'none';  // 기본적으로 숨김
        helperText.textContent = '';

        // 제목만 비었을 경우 에러 메시지
        if (titleInput.value.trim() === '' && contentInput.value.trim() !== '') {
            console.log("제목이 비어있음");
            helperText.textContent = '* 제목을 작성해주세요';
            helperText.style.display = 'block';  // 에러 메시지 표시
        }
        // 내용만 비었을 경우 에러 메시지
        else if (contentInput.value.trim() === '' && titleInput.value.trim() !== '') {
            console.log("내용이 비어있음");
            helperText.textContent = '* 내용을 작성해주세요';
            helperText.style.display = 'block';  // 에러 메시지 표시
        }
        // 제목과 내용이 모두 비었을 경우 에러 메시지
        else if (titleInput.value.trim() === '' && contentInput.value.trim() === '') {
            console.log("제목과 내용이 모두 비어있음");
            helperText.textContent = '* 제목과 내용을 모두 작성해주세요';
            helperText.style.display = 'block';  // 에러 메시지 표시
        } else {
            console.log("폼 제출 성공");
            // 에러가 없으면 boardList로 이동
            helperText.style.display = 'none';  // 에러 메시지 숨김
            window.location.href = '/boardList';  // boardList로 리디렉션
        }
    });

    // 드롭다운 메뉴 기능 추가
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

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

    // 초기 버튼 상태 확인
    checkForm();
});

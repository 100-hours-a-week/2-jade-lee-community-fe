document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed"); // 확인 로그 추가
    const imagePreview = document.getElementById('imagePreview');
    const profileImageInput = document.getElementById('profileImage');

    // 이미지 미리보기 기능
    profileImageInput.addEventListener("change", function(event) {
        imagePreview.src = URL.createObjectURL(event.target.files[0]);
        imagePreview.style.display = 'block';
    });

    // 클릭 시 파일 선택 창 열기
    imagePreview.addEventListener("click", function () {
        profileImageInput.click();
    });

    // 드롭다운 메뉴 기능
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

    // 드롭다운 링크 클릭 시 페이지 이동
    dropdownContent.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.stopPropagation(); // 드롭다운 메뉴 닫히는 것을 방지
            const href = this.getAttribute('href');
            window.location.href = href; 
        });
    });

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        alert("회원가입이 완료되었습니다!"); 
        window.location.href = '/login';
    });
});

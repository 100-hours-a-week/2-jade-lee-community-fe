document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('boardWriteForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        window.location.href = '/boardList'; 
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
});
